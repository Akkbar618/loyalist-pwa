/**
 * Rewards Storage - Manages shown rewards in localStorage
 * Prevents showing the same reward modal multiple times
 */

/**
 * Creates a rewards storage instance for a specific user
 * @param {string} userId - User's unique ID
 * @returns {Object} Storage methods
 */
export function createRewardsStorage(userId) {
    const storageKey = `shown_rewards_${userId}`;

    return {
        /**
         * Get all shown rewards
         * @returns {Object} Map of cafeId -> array of timestamps
         */
        getAll() {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : {};
        },

        /**
         * Check if a reward was already shown
         * @param {string} cafeId - Cafe ID
         * @param {number} timestamp - Reward timestamp
         * @returns {boolean}
         */
        isShown(cafeId, timestamp) {
            const shown = this.getAll();
            return shown[cafeId] && shown[cafeId].includes(timestamp);
        },

        /**
         * Mark a reward as shown
         * @param {string} cafeId - Cafe ID
         * @param {number} timestamp - Reward timestamp
         */
        markAsShown(cafeId, timestamp) {
            const shown = this.getAll();
            if (!shown[cafeId]) {
                shown[cafeId] = [];
            }
            if (!shown[cafeId].includes(timestamp)) {
                shown[cafeId].push(timestamp);
                localStorage.setItem(storageKey, JSON.stringify(shown));
            }
        },

        /**
         * Clear all shown rewards (for debugging)
         */
        clear() {
            localStorage.removeItem(storageKey);
        }
    };
}
