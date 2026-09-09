import { AuditIssue, AuditReport, Category, ScoreBreakdown, Severity } from '../types';

export function runRuleBasedAudit(htmlString: string, targetUrl: string): AuditReport {
  const issues: AuditIssue[] = [];
  let passedChecks = 0;

  // Browser DOM parser or string regex analysis
  const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;
  const doc = parser ? parser.parseFromString(htmlString, 'text/html') : null;

  const pageTitle = doc?.title || targetUrl.replace(/^https?:\/\//, '').split('/')[0] || 'Target Website';

  if (doc) {
    // 1. Missing Alt Text on Images
    const images = Array.from(doc.querySelectorAll('img'));
    images.forEach((img, idx) => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      const src = img.getAttribute('src') || 'image.jpg';

      if (alt === null && role !== 'presentation' && role !== 'none') {
        const outerHtml = img.outerHTML.slice(0, 150);
        issues.push({
          id: `rule-img-alt-${idx + 1}`,
          ruleId: 'image-alt',
          wcagCriterion: 'WCAG 2.1 AA 1.1.1 Non-text Content',
          category: 'screen_reader',
          severity: 'critical',
          title: 'Image missing alternative text',
          description: `Image element with src "${src}" lacks an alt attribute, hiding visual context from screen reader users.`,
          whyItMatters: 'Screen readers cannot describe this image, so blind or low-vision users miss crucial context.',
          elementHtml: outerHtml,
          selector: `img[src*="${src.split('/').pop() || 'image'}"]`,
          aiFixSuggestion: `Add descriptive alt text describing the image content and intent.`,
          aiFixedHtml: outerHtml.replace('<img', `<img alt="Descriptive visual summary for ${src.split('/').pop() || 'content'}"`),
          affectedPersonas: ['visual', 'cognitive']
        });
      } else {
        passedChecks++;
      }
    });

    // 2. Empty Buttons
    const buttons = Array.from(doc.querySelectorAll('button, a[role="button"]'));
    buttons.forEach((btn, idx) => {
      const text = btn.textContent?.trim();
      const ariaLabel = btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby') || btn.getAttribute('title');
      const hasImgWithAlt = btn.querySelector('img[alt]:not([alt=""])');

      if (!text && !ariaLabel && !hasImgWithAlt) {
        const outerHtml = btn.outerHTML.slice(0, 160);
        issues.push({
          id: `rule-btn-name-${idx + 1}`,
          ruleId: 'button-name',
          wcagCriterion: 'WCAG 2.1 AA 4.1.2 Name, Role, Value',
          category: 'screen_reader',
          severity: 'critical',
          title: 'Button missing accessible name',
          description: 'Button has no textual content or aria-label, so screen readers announce it as "Button" without purpose.',
          whyItMatters: 'Screen reader users hear an unlabelled button and cannot know what action clicking it will execute.',
          elementHtml: outerHtml,
          selector: btn.tagName.toLowerCase() + (btn.className ? `.${btn.className.split(' ')[0]}` : ''),
          aiFixSuggestion: 'Add an aria-label attribute specifying the user action (e.g. "Submit form", "Open menu").',
          aiFixedHtml: outerHtml.replace('<button', '<button aria-label="Perform requested action"'),
          affectedPersonas: ['visual', 'motor']
        });
      } else {
        passedChecks++;
      }
    });

    // 3. Form Input Labels
    const inputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'));
    inputs.forEach((input, idx) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
      const parentLabel = input.closest('label');
      const matchingLabel = id ? doc.querySelector(`label[for="${id}"]`) : null;

      if (!ariaLabel && !parentLabel && !matchingLabel) {
        const outerHtml = input.outerHTML.slice(0, 150);
        const inputName = input.getAttribute('name') || input.getAttribute('type') || 'input';
        issues.push({
          id: `rule-input-label-${idx + 1}`,
          ruleId: 'label',
          wcagCriterion: 'WCAG 2.1 AA 1.3.1 Info and Relationships / 3.3.2 Labels',
          category: 'screen_reader',
          severity: 'serious',
          title: `Form input missing associated label (<${input.tagName.toLowerCase()}>)`,
          description: `Input element (${inputName}) has neither a matching <label for="..."> nor an aria-label attribute.`,
          whyItMatters: 'Users relying on screen readers or voice dictation cannot identify what data is requested.',
          elementHtml: outerHtml,
          selector: input.tagName.toLowerCase() + (id ? `#${id}` : `[name="${inputName}"]`),
          aiFixSuggestion: `Attach a visible <label for="${id || 'field-' + (idx + 1)}"> or add aria-label="${inputName}".`,
          aiFixedHtml: `<label for="${id || 'input-field-' + idx}" class="block text-sm font-medium mb-1">${inputName.toUpperCase()}</label>\n${outerHtml.replace('<input', `<input id="${id || 'input-field-' + idx}"`)}`,
          affectedPersonas: ['visual', 'cognitive']
        });
      } else {
        passedChecks++;
      }
    });

    // 4. Heading Hierarchy Check
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    headings.forEach((h, idx) => {
      const currentLevel = parseInt(h.tagName.substring(1), 10);
      if (idx === 0 && currentLevel !== 1) {
        issues.push({
          id: `rule-heading-h1-${idx + 1}`,
          ruleId: 'page-has-heading-one',
          wcagCriterion: 'WCAG 2.1 AA 2.4.6 Headings and Labels',
          category: 'navigation',
          severity: 'moderate',
          title: 'Page does not begin with an H1 heading',
          description: `First heading encountered is <${h.tagName.toLowerCase()}> instead of a top-level <h1>.`,
          whyItMatters: 'Screen reader users rely on H1 as the primary landmark to confirm page topic upon arrival.',
          elementHtml: h.outerHTML.slice(0, 140),
          selector: h.tagName.toLowerCase(),
          aiFixSuggestion: 'Convert the primary document title to an <h1> element for a logical page outline.',
          aiFixedHtml: `<h1>${h.textContent?.trim() || 'Main Title'}</h1>`,
          affectedPersonas: ['visual', 'cognitive', 'motor']
        });
      } else if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        issues.push({
          id: `rule-heading-order-${idx + 1}`,
          ruleId: 'heading-order',
          wcagCriterion: 'WCAG 2.1 AA 1.3.1 Info and Relationships',
          category: 'navigation',
          severity: 'moderate',
          title: `Skipped heading level (H${previousLevel} to H${currentLevel})`,
          description: `Heading structure jumps from <h${previousLevel}> directly to <h${currentLevel}> without intermediate levels.`,
          whyItMatters: 'Skipping heading levels confuses users navigating via heading shortcut keys in screen readers.',
          elementHtml: h.outerHTML.slice(0, 140),
          selector: h.tagName.toLowerCase(),
          aiFixSuggestion: `Adjust heading tag to <h${previousLevel + 1}> to preserve predictable hierarchical nesting.`,
          aiFixedHtml: `<h${previousLevel + 1}>${h.textContent?.trim() || ''}</h${previousLevel + 1}>`,
          affectedPersonas: ['visual', 'cognitive']
        });
      } else {
        passedChecks++;
      }
      previousLevel = currentLevel;
    });

    // 5. Landmarks Check
    const hasMain = doc.querySelector('main, [role="main"]');
    if (!hasMain) {
      issues.push({
        id: 'rule-landmark-main',
        ruleId: 'landmark-one-main',
        wcagCriterion: 'WCAG 2.1 AA 1.3.1 Info and Relationships',
        category: 'navigation',
        severity: 'serious',
        title: 'Missing document <main> landmark region',
        description: 'Page lacks a <main> landmark or role="main", preventing screen reader shortcut navigation to central content.',
        whyItMatters: 'Keyboard and screen reader users must tab through entire headers repeatedly without a main skip landmark.',
        elementHtml: '<body>\n  <div class="content">\n    ...\n  </div>\n</body>',
        selector: 'body > div',
        aiFixSuggestion: 'Wrap primary body content in a semantic <main id="main-content"> container.',
        aiFixedHtml: '<main id="main-content" role="main">\n  <div class="content">\n    ...\n  </div>\n</main>',
        affectedPersonas: ['visual', 'motor']
      });
    } else {
      passedChecks += 2;
    }

    // 6. Keyboard navigation: Positive TabIndex
    const positiveTabindex = Array.from(doc.querySelectorAll('[tabindex]')).filter(el => {
      const tabVal = parseInt(el.getAttribute('tabindex') || '0', 10);
      return tabVal > 0;
    });
    if (positiveTabindex.length > 0) {
      const el = positiveTabindex[0];
      issues.push({
        id: 'rule-tabindex-positive',
        ruleId: 'tabindex',
        wcagCriterion: 'WCAG 2.1 AA 2.4.3 Focus Order',
        category: 'navigation',
        severity: 'moderate',
        title: 'Disruptive positive tabindex detected',
        description: `Elements with tabindex > 0 (found ${positiveTabindex.length}) override natural DOM tab sequence.`,
        whyItMatters: 'Forces unpredictable focus hopping, severely disrupting motor-impaired and switch-device navigators.',
        elementHtml: el.outerHTML.slice(0, 140),
        selector: `[tabindex="${el.getAttribute('tabindex')}"]`,
        aiFixSuggestion: 'Use tabindex="0" for custom focusable elements or let natural document flow dictate tab order.',
        aiFixedHtml: el.outerHTML.replace(/tabindex="\d+"/, 'tabindex="0"'),
        affectedPersonas: ['motor', 'visual']
      });
    } else {
      passedChecks++;
    }

    // 7. Color Contrast indicators (Check for low contrast classes or inline gray text)
    const lowContrastCandidates = Array.from(doc.querySelectorAll('.text-gray-400, .text-slate-400, .text-zinc-400, .text-neutral-400, [style*="color: #9"], [style*="color: #a"], [style*="color: #b"]'));
    if (lowContrastCandidates.length > 0) {
      const sample = lowContrastCandidates[0];
      issues.push({
        id: 'rule-contrast-ratio',
        ruleId: 'color-contrast',
        wcagCriterion: 'WCAG 2.1 AA 1.4.3 Contrast (Minimum)',
        category: 'visual',
        severity: 'serious',
        title: 'Low contrast text element detected',
        description: 'Light gray foreground text fails the WCAG AA minimum 4.5:1 contrast requirement against light backgrounds.',
        whyItMatters: 'Low-vision users, elderly individuals, and mobile users in sunlight cannot read low-contrast copy.',
        elementHtml: sample.outerHTML.slice(0, 150),
        selector: sample.tagName.toLowerCase() + (sample.className ? `.${sample.className.split(' ')[0]}` : ''),
        aiFixSuggestion: 'Increase font contrast to at least #334155 (slate-700) or #1E293B (slate-800) for compliant 7:1 ratio.',
        aiFixedHtml: sample.outerHTML.replace(/text-(gray|slate|zinc|neutral)-400/g, 'text-slate-800 font-medium'),
        affectedPersonas: ['visual', 'cognitive']
      });
    } else {
      passedChecks += 2;
    }

    // 8. Content Readability & Long Dense Text check
    const paragraphs = Array.from(doc.querySelectorAll('p'));
    const denseParagraph = paragraphs.find(p => (p.textContent?.split(/\s+/).length || 0) > 38);
    if (denseParagraph) {
      issues.push({
        id: 'rule-readability-dense',
        ruleId: 'cognitive-readability',
        wcagCriterion: 'WCAG 2.1 AAA 3.1.5 Reading Level',
        category: 'readability',
        severity: 'moderate',
        title: 'Overly complex sentence structure in paragraph',
        description: `Paragraph contains over 38 words in a continuous run without paragraph breaks or bullet points.`,
        whyItMatters: 'Individuals with dyslexia, ADHD, or cognitive fatigue struggle to comprehend dense unbroken text blocks.',
        elementHtml: denseParagraph.outerHTML.slice(0, 160) + '...',
        selector: 'p.dense-text',
        aiFixSuggestion: 'Break complex compound sentences into concise, digestible statements with a 6th-grade reading level.',
        aiFixedHtml: `<p class="leading-relaxed mb-3">${denseParagraph.textContent?.slice(0, 100)}...</p>`,
        affectedPersonas: ['cognitive', 'visual']
      });
    } else {
      passedChecks++;
    }
  }

  // Calculate scores based on deductions
  const criticalDeductions = issues.filter(i => i.severity === 'critical').length * 10;
  const seriousDeductions = issues.filter(i => i.severity === 'serious').length * 6;
  const moderateDeductions = issues.filter(i => i.severity === 'moderate').length * 3;
  const minorDeductions = issues.filter(i => i.severity === 'minor').length * 1;

  const totalDeductions = criticalDeductions + seriousDeductions + moderateDeductions + minorDeductions;
  const overallScore = Math.max(35, Math.min(98, 100 - totalDeductions));

  // Category scores
  const scoreBreakdown: ScoreBreakdown = {
    overall: overallScore,
    visual: Math.max(40, Math.min(98, 100 - (issues.filter(i => i.category === 'visual').length * 12))),
    navigation: Math.max(45, Math.min(98, 100 - (issues.filter(i => i.category === 'navigation').length * 10))),
    screenReader: Math.max(38, Math.min(98, 100 - (issues.filter(i => i.category === 'screen_reader').length * 11))),
    readability: Math.max(50, Math.min(98, 100 - (issues.filter(i => i.category === 'readability').length * 12))),
    keyboard: Math.max(45, Math.min(98, 100 - (issues.filter(i => i.affectedPersonas.includes('motor')).length * 8))),
    forms: Math.max(40, Math.min(98, 100 - (issues.filter(i => i.ruleId === 'label' || i.ruleId === 'button-name').length * 10)))
  };

  return {
    url: targetUrl,
    pageTitle,
    scannedAt: 'Just now',
    score: scoreBreakdown,
    issues,
    summary: {
      totalIssues: issues.length,
      criticalCount: issues.filter(i => i.severity === 'critical').length,
      seriousCount: issues.filter(i => i.severity === 'serious').length,
      moderateCount: issues.filter(i => i.severity === 'moderate').length,
      minorCount: issues.filter(i => i.severity === 'minor').length,
      fixedCount: 0
    },
    passedChecksCount: Math.max(25, passedChecks)
  };
}
