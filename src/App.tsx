import React, { useState, useEffect } from 'react';
import {
  Investigation,
  Question,
  Source,
  QuestionCategory,
} from './types';
import {
  getActiveInvestigation,
  saveActiveInvestigation,
  getSavedInvestigations,
  saveInvestigationToList,
  toggleChecklistItem,
  deleteSavedInvestigation,
  resetToDemoInvestigation,
} from './lib/storage';
import { runFullInvestigationAnalysis } from './lib/gapAnalyzer';
import { calculateScoringBreakdown } from './lib/scoring';
import { Navbar } from './components/layout/Navbar';
import { ProgressTracker, AppStage } from './components/layout/ProgressTracker';
import { DemoBanner } from './components/layout/DemoBanner';
import { Toast } from './components/ui/Toast';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CategoryPickerPage } from './pages/CategoryPickerPage';
import { CaseFilePage } from './pages/CaseFilePage';
import { EvidenceCollectionPage } from './pages/EvidenceCollectionPage';
import { AnalysisOverviewPage } from './pages/AnalysisOverviewPage';
import { TruthClashPage } from './pages/TruthClashPage';
import { InvisibleQuestionsPage } from './pages/InvisibleQuestionsPage';
import { TimeTravellerPage } from './pages/TimeTravellerPage';
import { EvidenceReferencesPage } from './pages/EvidenceReferencesPage';
import { ConfidenceCompassPage } from './pages/ConfidenceCompassPage';
import { FinalReportPage } from './pages/FinalReportPage';

export default function App() {
  const [investigation, setInvestigation] = useState<Investigation>(() => getActiveInvestigation());
  const [savedList, setSavedList] = useState<Investigation[]>(() => getSavedInvestigations());

  // Check URL params for autostart
  const [currentView, setCurrentView] = useState<AppStage | 'landing' | 'dashboard'>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('dashboard') === '1') {
      return 'dashboard';
    }
    if (params.get('demo') === '1') {
      return 'analysis';
    }
    return 'landing';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Temporary staging for category & questions when building a new case
  const [stagingCategory, setStagingCategory] = useState<QuestionCategory | null>(null);
  const [stagingQuestions, setStagingQuestions] = useState<Question[]>([]);

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Start a fresh, real investigation
  const handleStartNewInvestigation = () => {
    setStagingCategory(null);
    setStagingQuestions([]);
    setCurrentView('category');
  };

  // Load sample demo investigation
  const handleLoadDemo = () => {
    const demo = resetToDemoInvestigation();
    setInvestigation(demo);
    setSavedList(getSavedInvestigations());
    setCurrentView('analysis');
    showToast('Loaded demo case: Global Excellence Scholarship 2026', 'info');
  };

  // Reset demo
  const handleResetDemo = () => {
    const demo = resetToDemoInvestigation();
    setInvestigation(demo);
    setSavedList(getSavedInvestigations());
    showToast('Demo case reset to fresh default values.', 'info');
  };

  // Category chosen and questions refined
  const handleCategoryContinue = (
    cat: QuestionCategory,
    questions: Question[],
    suggestedPrompt?: { topic: string; mainQuestion: string; objective: string }
  ) => {
    setStagingCategory(cat);
    setStagingQuestions(questions);
    setCurrentView('case-file');
  };

  // Case file details entered -> proceed to evidence
  const handleCaseFileProceed = (data: {
    topic: string;
    mainQuestion: string;
    objective: string;
    context: string;
  }) => {
    const questionsToUse = stagingQuestions.length > 0 ? stagingQuestions : investigation.questions;
    const catId = stagingCategory?.id || investigation.categoryId || 'general-research';
    const catName = stagingCategory?.name || investigation.categoryName || 'General Research';

    const newInv: Investigation = {
      id: `inv-${Date.now()}`,
      title: data.topic,
      categoryId: catId,
      categoryName: catName,
      mainQuestion: data.mainQuestion,
      researchObjective: data.objective,
      optionalContext: data.context,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
      status: 'draft',
      analysisEngine: 'rule-based',
      questions: questionsToUse,
      sources: stagingCategory ? [] : investigation.sources, // start fresh if new category
      truthClashes: [],
      checklist: [],
      scoring: calculateScoringBreakdown(questionsToUse),
      characterReactions: {
        shinchan: "Chief Detective Shinchan: 'New case opened! Let's collect evidence documents!'",
        kazama: "Logic Specialist Kazama: 'Waiting for source text to audit logic consistency.'",
        nene: "Mystery Sleuth Nene: 'Let's see what questions these sources forgot to answer!'",
        masao: "Time Investigator Masao: 'Remember to check the publication dates on all sources!'",
        bochan: "Evidence Master Bo-chan: 'Paste exact text so we can verify exact substrings!'",
      },
    };

    setInvestigation(newInv);
    saveActiveInvestigation(newInv);
    saveInvestigationToList(newInv);
    setSavedList(getSavedInvestigations());
    setCurrentView('evidence');
  };

  // Add a source to active investigation
  const handleAddSource = (src: Source) => {
    const updatedSources = [...investigation.sources, src];
    const updatedInv: Investigation = {
      ...investigation,
      sources: updatedSources,
      updatedAt: new Date().toISOString(),
    };
    setInvestigation(updatedInv);
    saveActiveInvestigation(updatedInv);
    saveInvestigationToList(updatedInv);
    showToast(`Added source: ${src.title}`, 'success');
  };

  // Remove a source from active investigation
  const handleRemoveSource = (id: string) => {
    const updatedSources = investigation.sources.filter((s) => s.id !== id);
    const updatedInv: Investigation = {
      ...investigation,
      sources: updatedSources,
      updatedAt: new Date().toISOString(),
    };
    setInvestigation(updatedInv);
    saveActiveInvestigation(updatedInv);
    saveInvestigationToList(updatedInv);
    showToast('Source removed from evidence deck.', 'info');
  };

  // Run Gap Analysis Engine
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      try {
        const { analyzedQuestions, truthClashes, checklist } = runFullInvestigationAnalysis(
          investigation.questions,
          investigation.sources
        );

        const scoring = calculateScoringBreakdown(analyzedQuestions);

        const updatedInv: Investigation = {
          ...investigation,
          status: 'analyzed',
          questions: analyzedQuestions,
          truthClashes,
          checklist,
          scoring,
          characterReactions: {
            shinchan: `Chief Detective Shinchan: 'Aha! We calculated a ${scoring.scorePercentage}% verified coverage! We found ${truthClashes.length} truth clashes and ${checklist.length} checklist items to verify!'`,
            kazama: `Logic Investigator Kazama: 'I examined all claims. Found ${truthClashes.length} direct contradictions between sources!'`,
            nene: `Mystery Sleuth Nene: 'I caught ${scoring.notFoundCount + scoring.partialCount} invisible questions that your sources didn't answer!'`,
            masao: `Time Investigator Masao: 'We have ${scoring.outdatedCount} outdated cycle findings to watch out for!'`,
            bochan: `Evidence Investigator Bo-chan: 'Every single finding is linked to an exact substring in your evidence texts!'`,
          },
          updatedAt: new Date().toISOString(),
        };

        setInvestigation(updatedInv);
        saveActiveInvestigation(updatedInv);
        saveInvestigationToList(updatedInv);
        setSavedList(getSavedInvestigations());
        setCurrentView('analysis');
        showToast('Gap Analysis completed! Results ready to inspect.', 'success');
      } catch (err) {
        console.error('Analysis failed', err);
        showToast('Analysis error occurred. Please check source texts.', 'warning');
      } finally {
        setIsAnalyzing(false);
      }
    }, 450);
  };

  // Toggle checklist item
  const handleToggleChecklist = (checklistId: string) => {
    const updated = toggleChecklistItem(investigation, checklistId);
    setInvestigation(updated);
    setSavedList(getSavedInvestigations());
  };

  // Save investigation
  const handleSaveInvestigation = () => {
    saveInvestigationToList(investigation);
    setSavedList(getSavedInvestigations());
    showToast('Case file saved to archives!', 'success');
  };

  // Select an investigation from dashboard
  const handleSelectInvestigation = (inv: Investigation) => {
    setInvestigation(inv);
    saveActiveInvestigation(inv);
    setCurrentView(inv.status === 'analyzed' ? 'analysis' : 'evidence');
    showToast(`Switched to: ${inv.title}`, 'info');
  };

  // Delete an investigation
  const handleDeleteInvestigation = (id: string) => {
    const remaining = deleteSavedInvestigation(id);
    setSavedList(remaining);
    if (investigation.id === id) {
      const fallback = remaining[0] || resetToDemoInvestigation();
      setInvestigation(fallback);
      saveActiveInvestigation(fallback);
    }
    showToast('Case deleted from archives.', 'info');
  };

  // Copy text report
  const handleCopyReport = () => {
    const textReport = [
      `========================================`,
      `INFO-DETECTIVE INVESTIGATION DOSSIER`,
      `"Every Answer Has a Missing Piece."`,
      `========================================`,
      `Case Title: ${investigation.title}`,
      `Category: ${investigation.categoryName}`,
      `Core Query: ${investigation.mainQuestion}`,
      `Objective: ${investigation.researchObjective}`,
      `Coverage Score: ${investigation.scoring?.scorePercentage || 0}%`,
      `Sources Reviewed: ${investigation.sources.length}`,
      ``,
      `--- TRUTH CLASHES (${investigation.truthClashes?.length || 0}) ---`,
      ...(investigation.truthClashes || []).map(
        (c, i) =>
          `[${i + 1}] ${c.questionText}\n  • Claim A: "${c.claimA.value}" (${c.claimA.sourceTitle})\n  • Claim B: "${c.claimB.value}" (${c.claimB.sourceTitle})\n  • Advice: ${c.verificationAdvice}`
      ),
      ``,
      `--- INVISIBLE GAPS & UNANSWERED QUESTIONS ---`,
      ...investigation.questions
        .filter((q) => q.status === 'not-found' || q.status === 'partially-answered')
        .map((q) => `• [${q.topic}] ${q.text}\n  Why it matters: ${q.whyItMatters}`),
      ``,
      `--- VERIFICATION CHECKLIST ---`,
      ...investigation.checklist.map(
        (chk) => `[${chk.completed ? 'X' : ' '}] ${chk.task} (Priority: ${chk.priority})`
      ),
      `========================================`,
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textReport)
        .then(() => {
          showToast('Full plain-text report copied to clipboard!', 'success');
        })
        .catch(() => {
          showToast('Report generated successfully! (Clipboard access restricted by browser permissions)', 'info');
        });
    } else {
      showToast('Report prepared! Select text directly to copy.', 'info');
    }
  };

  const isAnalyzed = investigation.status === 'analyzed';

  return (
    <div className="min-h-screen bg-[#FFF8E9] text-[#26334A] flex flex-col font-sans">
      {/* Demo Notification Banner */}
      <DemoBanner
        isDemo={investigation.isDemo}
        onStartRealInvestigation={handleStartNewInvestigation}
        onResetDemo={handleResetDemo}
      />

      {/* Main Navbar */}
      <Navbar
        currentStage={currentView}
        onNavigate={(stage) => setCurrentView(stage)}
        onNewInvestigation={handleStartNewInvestigation}
        onLoadDemo={handleLoadDemo}
        isDemo={investigation.isDemo}
        hasAnalyzed={isAnalyzed}
      />

      {/* Progress Tracker (visible on case-related views) */}
      {currentView !== 'landing' && currentView !== 'dashboard' && (
        <ProgressTracker
          currentStage={currentView as AppStage}
          onNavigateStage={(stage) => setCurrentView(stage)}
          hasAnalyzed={isAnalyzed}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'landing' && (
          <LandingPage
            onStartInvestigation={handleStartNewInvestigation}
            onExploreDemo={handleLoadDemo}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            investigation={investigation}
            savedInvestigations={savedList}
            onSelectInvestigation={handleSelectInvestigation}
            onDeleteInvestigation={handleDeleteInvestigation}
            onNavigateStage={(stage) => setCurrentView(stage)}
            onNewInvestigation={handleStartNewInvestigation}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentView === 'category' && (
          <CategoryPickerPage
            initialCategoryId={investigation.categoryId || 'scholarships'}
            initialQuestions={stagingQuestions.length > 0 ? stagingQuestions : undefined}
            onContinueToCaseFile={handleCategoryContinue}
          />
        )}

        {currentView === 'case-file' && (
          <CaseFilePage
            category={
              stagingCategory || {
                id: investigation.categoryId || 'scholarships',
                name: investigation.categoryName || 'Scholarships',
                icon: 'GraduationCap',
                character: 'nene',
                description: 'Check eligibility, deadlines, and renewal terms.',
                keywords: ['scholarship'],
                suggestedPrompt: {
                  topic: investigation.title,
                  mainQuestion: investigation.mainQuestion,
                  objective: investigation.researchObjective,
                },
                questions: [],
              }
            }
            initialTopic={investigation.title}
            initialMainQuestion={investigation.mainQuestion}
            initialObjective={investigation.researchObjective}
            initialContext={investigation.optionalContext}
            onProceedToEvidence={handleCaseFileProceed}
            onBackToQuestions={() => setCurrentView('category')}
          />
        )}

        {currentView === 'evidence' && (
          <EvidenceCollectionPage
            sources={investigation.sources}
            onAddSource={handleAddSource}
            onRemoveSource={handleRemoveSource}
            onRunAnalysis={handleRunAnalysis}
            onBackToCaseFile={() => setCurrentView('case-file')}
            isAnalyzing={isAnalyzing}
          />
        )}

        {currentView === 'analysis' && (
          <AnalysisOverviewPage
            investigation={investigation}
            onNavigateStage={(stage) => setCurrentView(stage)}
          />
        )}

        {currentView === 'truth-clash' && (
          <TruthClashPage
            investigation={investigation}
            onNavigateToReport={() => setCurrentView('report')}
          />
        )}

        {currentView === 'invisible-questions' && (
          <InvisibleQuestionsPage
            investigation={investigation}
            onNavigateToReport={() => setCurrentView('report')}
          />
        )}

        {currentView === 'time-traveller' && (
          <TimeTravellerPage
            investigation={investigation}
            onNavigateToReport={() => setCurrentView('report')}
          />
        )}

        {currentView === 'evidence-refs' && (
          <EvidenceReferencesPage
            investigation={investigation}
            onNavigateToReport={() => setCurrentView('report')}
          />
        )}

        {currentView === 'confidence' && (
          <ConfidenceCompassPage
            investigation={investigation}
            onNavigateToReport={() => setCurrentView('report')}
          />
        )}

        {currentView === 'report' && (
          <FinalReportPage
            investigation={investigation}
            onToggleChecklist={handleToggleChecklist}
            onSaveInvestigation={handleSaveInvestigation}
            onReturnToDashboard={() => setCurrentView('dashboard')}
            onCopyReport={handleCopyReport}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
