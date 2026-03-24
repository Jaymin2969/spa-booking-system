export const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  ACTION: 'ACTION'
};

class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    this.logs.push(entry);
    
    // Print to console based on level
    if (level === LogLevel.ERROR) {
      console.error(`[${entry.timestamp}] [${level}] ${message}`, data || '');
    } else if (level === LogLevel.WARN) {
      console.warn(`[${entry.timestamp}] [${level}] ${message}`, data || '');
    } else if (level === LogLevel.ACTION) {
      console.log(`%c[${entry.timestamp}] [${level}] ${message}`, 'color: #3B82F6', data || '');
    } else {
      console.log(`[${entry.timestamp}] [${level}] ${message}`, data || '');
    }
    
    // In a real app, we might also push to a remote logging service here or periodically locally store
    try {
      if (this.logs.length > 1000) this.logs.shift(); // keep it constrained in local memory
    } catch (e) {}
  }

  error(message, error = null) {
    this.log(LogLevel.ERROR, message, error);
  }

  action(message, data = null) {
    this.log(LogLevel.ACTION, message, data);
  }

  info(message, data = null) {
    this.log(LogLevel.INFO, message, data);
  }
}

export const logger = new Logger();
