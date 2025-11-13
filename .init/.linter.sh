#!/bin/bash
cd /home/kavia/workspace/code-generation/collaborative-task-board-224035-224048/task_board_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

