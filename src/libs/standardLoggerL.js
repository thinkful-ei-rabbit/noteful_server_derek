const path = require('path');

const { format, transports, createLogger, config } = require('winston');

const { NODE_ENV } = require('../config/envConfig');

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize({ colors: { info: 'blue' } }),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.align(),
  format.printf(
    (info) => `[${info.timestamp}] ❗${info.level}: ${info.message}`
  )
);

const logger = createLogger();
const levels = Object.keys(config.npm.levels);

levels.forEach((level) => {
  // separates write files by level
  const filter = format((log) => (log.level === level ? log : false));

  const filename = path.resolve(__dirname, `logs/${level}.log`);

  logger.add(
    new transports.File({
      filename,
      level,
      maxsize: 20000000, // 20MB
      tailable: true,
      zippedArchive: true,
      format: format.combine(filter(), fileFormat),
    })
  );
});

if (NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      level: 'silly',
      format: consoleFormat
    })
  );
}

module.exports = logger;
