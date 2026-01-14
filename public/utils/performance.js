/**
 * Performance Monitoring Utility
 * Web Vitals tracking and performance metrics
 */

// Performance metrics storage
const metrics = {};

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
    // Track page load timing
    if (window.performance) {
        window.addEventListener('load', () => {
            setTimeout(measurePageLoad, 0);
        });
    }

    // Track Core Web Vitals
    trackWebVitals();

    console.log('[Performance] Monitoring initialized');
}

/**
 * Measure page load performance
 */
function measurePageLoad() {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0];

    if (navigation) {
        metrics.pageLoad = {
            // DNS lookup
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            // TCP connection
            tcpConnection: navigation.connectEnd - navigation.connectStart,
            // Time to First Byte
            ttfb: navigation.responseStart - navigation.requestStart,
            // DOM Content Loaded
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            // Full page load
            pageLoad: navigation.loadEventEnd - navigation.fetchStart,
            // DOM Interactive
            domInteractive: navigation.domInteractive - navigation.fetchStart
        };
    } else if (timing) {
        metrics.pageLoad = {
            dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
            tcpConnection: timing.connectEnd - timing.connectStart,
            ttfb: timing.responseStart - timing.requestStart,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            pageLoad: timing.loadEventEnd - timing.navigationStart,
            domInteractive: timing.domInteractive - timing.navigationStart
        };
    }

    console.log('[Performance] Page load metrics:', metrics.pageLoad);
}

/**
 * Track Core Web Vitals (LCP, FID, CLS)
 */
function trackWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
        try {
            // LCP
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                metrics.lcp = lastEntry.startTime;
                console.log('[Performance] LCP:', metrics.lcp);
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // FID
            const fidObserver = new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                metrics.fid = firstInput.processingStart - firstInput.startTime;
                console.log('[Performance] FID:', metrics.fid);
            });
            fidObserver.observe({ type: 'first-input', buffered: true });

            // CLS
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                metrics.cls = clsValue;
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });

        } catch (e) {
            console.warn('[Performance] Web Vitals tracking not fully supported');
        }
    }
}

/**
 * Get all collected metrics
 * @returns {Object}
 */
export function getMetrics() {
    return { ...metrics };
}

/**
 * Measure custom operation duration
 * @param {string} name - Operation name
 * @returns {Function} Stop function that returns duration
 */
export function startMeasure(name) {
    const startTime = performance.now();

    return () => {
        const duration = performance.now() - startTime;

        if (!metrics.custom) {
            metrics.custom = {};
        }

        metrics.custom[name] = duration;
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

        return duration;
    };
}

/**
 * Track resource loading performance
 * @param {string} resourceType - 'script' | 'img' | 'css' | 'font'
 */
export function getResourceMetrics(resourceType) {
    const resources = performance.getEntriesByType('resource');

    return resources
        .filter(r => {
            if (resourceType === 'script') return r.name.endsWith('.js');
            if (resourceType === 'css') return r.name.endsWith('.css');
            if (resourceType === 'img') return /\.(png|jpg|jpeg|gif|svg|webp)/.test(r.name);
            if (resourceType === 'font') return /\.(woff|woff2|ttf|otf)/.test(r.name);
            return true;
        })
        .map(r => ({
            name: r.name.split('/').pop(),
            duration: r.duration,
            size: r.transferSize
        }));
}

/**
 * Mark a point in time for performance timeline
 * @param {string} markName 
 */
export function mark(markName) {
    if (performance.mark) {
        performance.mark(markName);
    }
}

/**
 * Measure between two marks
 * @param {string} measureName 
 * @param {string} startMark 
 * @param {string} endMark 
 */
export function measure(measureName, startMark, endMark) {
    if (performance.measure) {
        try {
            performance.measure(measureName, startMark, endMark);
            const entries = performance.getEntriesByName(measureName);
            return entries[entries.length - 1]?.duration;
        } catch (e) {
            return null;
        }
    }
    return null;
}
