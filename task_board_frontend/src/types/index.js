/**
 * @typedef {"backlog"|"in_progress"|"review"|"done"} TaskStatus
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {TaskStatus} status
 * @property {number} order_index
 * @property {string|null} assignee_id
 * @property {string[]} labels
 * @property {string|null} due_date
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} board_id
 */

/**
 * @typedef {Object} Column
 * @property {string} id
 * @property {string} title
 * @property {"backlog"|"in_progress"|"review"|"done"} key
 * @property {number} order_index
 * @property {string} board_id
 */

/**
 * @typedef {Object} Board
 * @property {string} id
 * @property {string} name
 * @property {string} team_id
 */

/**
 * @typedef {Object} Team
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} user_id
 * @property {string} team_id
 * @property {"owner"|"admin"|"member"|"viewer"} role
 */

export {};
