'use strict';
window.CareIntake = Object.freeze({
  enabled() {
    const config = window.CARE_INTAKE_CONFIG;
    return config?.mode === 'local' && config.endpoint === '/api/intakes' &&
      ['127.0.0.1', 'localhost'].includes(window.location.hostname);
  },
  async submit(payload, key) {
    if (!this.enabled()) return { mode: 'preview' };
    const response = await fetch('/api/intakes', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '提交失败，请保留表单后重试。');
    return { ...result, mode: 'local' };
  },
});
