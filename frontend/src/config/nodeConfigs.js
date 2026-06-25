export const NODE_CONFIGS = {
    'ai-agent': { script: '', language: 'en-US' },
    'split': { field: 'sentiment', operator: '>', value: '70' },
    'sms': { template: '', variables: [] },
    'email': { subject: '', body: '' },
    'crm': { action: 'update_status', field: '' }
  };
  
  // Yeh function humein help karega settings panel mein default values load karne mein
  export const getDefaultConfig = (type) => {
    return NODE_CONFIGS[type] || {};
  };