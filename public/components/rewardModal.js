/**
 * Reward Modal Component
 * Shows congratulation modal when user receives a reward
 */

import { t } from '../translations.js';

/**
 * Shows a reward modal
 * @param {Object} cafeData - Cafe information with name property
 * @param {Function} onClose - Callback when modal is closed
 */
export function showRewardModal(cafeData, onClose) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.display = 'flex';

    modalOverlay.innerHTML = `
    <div class="reward-modal">
      <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M7.5 12.5l3 3 6-6"/>
      </svg>
      <h3>${t('main.congratulations')}</h3>
      <p>${t('main.rewardReceived').replace('{cafe}', cafeData.name)}</p>
      <button class="close-reward-btn">${t('main.great')}</button>
    </div>
  `;

    document.body.appendChild(modalOverlay);

    // Animate modal entrance
    requestAnimationFrame(() => {
        modalOverlay.querySelector('.reward-modal').classList.add('show');
    });

    const closeModal = () => {
        const modal = modalOverlay.querySelector('.reward-modal');
        modal.classList.remove('show');
        setTimeout(() => {
            modalOverlay.remove();
            if (onClose) onClose();
        }, 300);
    };

    // Close on button click
    const closeBtn = modalOverlay.querySelector('.close-reward-btn');
    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close on Escape key
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);

    return closeModal;
}
