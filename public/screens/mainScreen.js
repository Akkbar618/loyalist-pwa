/**
 * Main Screen - Shows user's QR code and loyalty points
 */

import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { t } from '../translations.js';
import { renderNavigation, cleanupNavigation } from '../components/navigation.js';
import { createRewardsStorage } from '../utils/rewardsStorage.js';
import { showRewardModal } from '../components/rewardModal.js';
import { renderQRCode } from '../components/qrCode.js';

/**
 * Shows the main screen with QR code and points cards
 * @param {HTMLElement} container - Container to render into
 * @param {Object} callbacks - Navigation callbacks
 */
export function showMainScreen(container, { onNavigateSettings, onNavigateLogout }) {
  container.innerHTML = '';

  // Render navigation menu
  const cleanupNav = renderNavigation({
    onNavigateMain: () => { }, // Already on main
    onNavigateSettings,
    onNavigateLogout
  });

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = '<div id="main-content"></div>';
  container.appendChild(screen);

  const mainContent = screen.querySelector('#main-content');
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();

  // Initialize rewards storage for current user
  const rewardsStorage = user ? createRewardsStorage(user.uid) : null;

  // Track rewards to detect new ones
  let previousRewardsCount = new Map();

  /**
   * Check and show reward modal if new reward received
   */
  function checkAndShowReward(cafeData, rewardsReceived, previousRewards, timestamp) {
    if (rewardsReceived > previousRewards && timestamp) {
      if (!rewardsStorage.isShown(cafeData.id, timestamp)) {
        showRewardModal(cafeData, () => {
          rewardsStorage.markAsShown(cafeData.id, timestamp);
        });
      }
    }
  }

  /**
   * Renders the main screen content
   */
  function renderScreen() {
    mainContent.innerHTML = `
      <div class="main-content">
        <div class="welcome-qr-section">
          <div class="welcome-header">
            ${t('main.hello')}, ${user?.email?.split('@')[0] || 'user'}!
            <br>${t('main.yourQR')}
          </div>
          <div class="qr-section">
            <div class="qr-code">
              <div id="qr-code"></div>
            </div>
          </div>
        </div>
        
        <div id="points-container"></div>
      </div>
    `;

    if (!user) return;

    // Render QR code
    const qrContainer = document.getElementById('qr-code');
    renderQRCode(qrContainer, user.uid);

    // Subscribe to points updates
    const pointsRef = collection(db, 'userPoints');
    const q = query(pointsRef, where('userId', '==', user.uid));

    onSnapshot(q, async (snapshot) => {
      const pointsContainer = document.getElementById('points-container');
      if (!pointsContainer) return;

      pointsContainer.innerHTML = '';

      if (snapshot.empty) {
        pointsContainer.innerHTML = `
          <div class="points-card">
            <div style="text-align: center; color: #666;">
              ${t('main.noPoints')}
            </div>
          </div>
        `;
        return;
      }

      for (const docSnapshot of snapshot.docs) {
        const pointData = docSnapshot.data();
        const previousRewards = previousRewardsCount.get(docSnapshot.id) || 0;

        try {
          const [cafeSnap, productSnap] = await Promise.all([
            getDoc(doc(db, 'cafes', pointData.cafeId)),
            getDoc(doc(db, 'products', pointData.productId))
          ]);

          if (!cafeSnap.exists() || !productSnap.exists()) continue;

          const cafe = cafeSnap.data();
          const product = productSnap.data();

          // Safe data extraction with defaults
          const currentProgress = pointData.currentProgress || 0;
          const totalPoints = pointData.totalPoints || 0;
          const scaleSize = product.scaleSize || 10;

          // Calculate rewards
          const rewardsReceived = pointData.rewardsReceived ?? Math.floor(currentProgress / scaleSize);
          const totalPossibleRewards = Math.floor(totalPoints / scaleSize);

          // Check for new rewards
          checkAndShowReward(
            { ...cafe, id: cafeSnap.id },
            rewardsReceived,
            previousRewards,
            pointData.lastUpdated
          );
          previousRewardsCount.set(docSnapshot.id, rewardsReceived);

          // Generate progress dots
          const dots = Array.from(
            { length: scaleSize },
            (_, i) => `<div class="dot ${i < currentProgress ? 'active' : ''}"></div>`
          ).join('');

          // Rewards display
          const rewardsDisplay = (rewardsReceived > 0 || totalPossibleRewards > 0)
            ? `<div class="rewards-count">${t('main.rewards')}: ${rewardsReceived} ${t('main.of')} ${totalPossibleRewards}</div>`
            : '';

          const card = document.createElement('div');
          card.className = 'points-card';
          card.innerHTML = `
            <div class="cafe-title">${cafe.name}</div>
            <div class="product-title">${product.name}</div>
            <div class="points-info-row">
              <div class="progress-dots">${dots}</div>
              ${rewardsDisplay}
            </div>
            <div class="update-time">
              ${t('main.lastUpdate')}: ${pointData.lastUpdated ? new Date(pointData.lastUpdated).toLocaleString() : '—'}
            </div>
          `;

          pointsContainer.appendChild(card);
        } catch (error) {
          console.error('Error loading card data:', error);
        }
      }
    });
  }

  renderScreen();

  // Re-render on language change
  const handleLanguageChange = () => renderScreen();
  window.addEventListener('languagechange', handleLanguageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('languagechange', handleLanguageChange);
    if (cleanupNav) cleanupNav();
  };
}