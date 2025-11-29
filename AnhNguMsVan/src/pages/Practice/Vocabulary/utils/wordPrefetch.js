/**
 * Prefetch ảnh của từ vựng để tối ưu trải nghiệm
 */
export class WordImagePrefetcher {
  constructor() {
    this.cache = new Map();
    this.queue = [];
    this.isProcessing = false;
    this.maxCacheSize = 50; // Giới hạn cache để tránh memory leak
  }

  /**
   * Prefetch một ảnh đơn
   */
  prefetchImage(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve();
        return;
      }

      // Kiểm tra đã cache chưa
      if (this.cache.has(url)) {
        resolve();
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        this.addToCache(url);
        resolve();
      };

      img.onerror = () => {
        console.warn(`Failed to prefetch image: ${url}`);
        reject(new Error(`Failed to load ${url}`));
      };

      img.src = url;
    });
  }

  /**
   * Prefetch nhiều ảnh cùng lúc
   */
  prefetchImages(urls) {
    const validUrls = urls.filter(url => url && !this.cache.has(url));
    return Promise.allSettled(validUrls.map(url => this.prefetchImage(url)));
  }

  /**
   * Prefetch ảnh của từ tiếp theo (background)
   */
  prefetchNextWord(words, currentIndex) {
    const nextIndex = currentIndex + 1;
    if (nextIndex < words.length && words[nextIndex].image) {
      this.addToQueue(words[nextIndex].image);
      this.processQueue();
    }
  }

  /**
   * Prefetch ảnh của 3 từ tiếp theo
   */
  prefetchNextWords(words, currentIndex, count = 3) {
    const urls = [];
    for (let i = 1; i <= count; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < words.length && words[nextIndex].image) {
        urls.push(words[nextIndex].image);
      }
    }
    
    urls.forEach(url => this.addToQueue(url));
    this.processQueue();
  }

  /**
   * Prefetch toàn bộ ảnh của topic (trong background)
   */
  prefetchTopicImages(words) {
    const urls = words
      .map(word => word.image)
      .filter(url => url && !this.cache.has(url));
    
    // Thêm vào queue với priority thấp
    urls.forEach(url => this.addToQueue(url, true));
    this.processQueue();
  }

  /**
   * Thêm URL vào queue
   */
  addToQueue(url, lowPriority = false) {
    if (!url || this.cache.has(url) || this.queue.includes(url)) {
      return;
    }

    if (lowPriority) {
      this.queue.push(url);
    } else {
      this.queue.unshift(url); // High priority - thêm vào đầu queue
    }
  }

  /**
   * Xử lý queue
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const url = this.queue.shift();
      try {
        await this.prefetchImage(url);
        // Delay nhỏ để không block main thread
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Prefetch error:', error);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Thêm vào cache với giới hạn size
   */
  addToCache(url) {
    // Xóa item cũ nhất nếu cache đầy
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(url, Date.now());
  }

  /**
   * Kiểm tra đã cache chưa
   */
  isCached(url) {
    return this.cache.has(url);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.queue = [];
  }

  /**
   * Get cache size
   */
  getCacheSize() {
    return this.cache.size;
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      queueLength: this.queue.length,
      isProcessing: this.isProcessing
    };
  }
}

// Singleton instance
export const wordPrefetcher = new WordImagePrefetcher();

/**
 * Hook helper để sử dụng trong component
 */
export const usePrefetchWords = () => {
  return {
    prefetchNextWord: (words, currentIndex) => 
      wordPrefetcher.prefetchNextWord(words, currentIndex),
    
    prefetchNextWords: (words, currentIndex, count) => 
      wordPrefetcher.prefetchNextWords(words, currentIndex, count),
    
    prefetchTopicImages: (words) => 
      wordPrefetcher.prefetchTopicImages(words),
    
    isCached: (url) => 
      wordPrefetcher.isCached(url),
    
    getStats: () => 
      wordPrefetcher.getStats()
  };
};