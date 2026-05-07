import logging
from logging.handlers import RotatingFileHandler
import os

if not os.path.exists("logs"):
    os.makedirs("logs")

logger = logging.getLogger("lpg_workflow_logger")

logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
)

file_handler = RotatingFileHandler(
    "logs/app.log",
    maxBytes=1024 * 1024,
    backupCount=5
)

file_handler.setFormatter(formatter)

console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)