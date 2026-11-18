/* Local, deterministic career exploration. No network or persistent storage. */
window.CAREDODO_CAREER = {
  evaluate(data, answers) {
    const selected = data.assessmentQuestions.map(question => ({
      question,
      option: question.options.find(option => option.id === answers[question.id])
    }));
    if (selected.some(item => !item.option)) return null;
    const ranked = data.careerRoles.map((role, index) => {
      const reasons = selected.filter(({ option }) => (option.scores[role.id] || 0) > 0);
      return { role, index, reasons, score: reasons.reduce((sum, { option }) => sum + option.scores[role.id], 0) };
    }).sort((a, b) => b.score - a.score || a.index - b.index);
    return {
      ranked,
      cna: answers.clinical !== 'no',
      needsPreparation: answers.learning !== 'ready' || answers.boundaries !== 'review' || answers.cpr === 'unsure',
      verifyCpr: answers.cpr === 'existing'
    };
  }
};
