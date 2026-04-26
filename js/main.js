document.documentElement.classList.add('js');

(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('[data-scroll-progress]');
  const backToTop = document.querySelector('[data-back-to-top]');
  const revealNodes = document.querySelectorAll('[data-reveal]');
  const tocLinks = Array.from(document.querySelectorAll('[data-toc] a'));
  const headings = Array.from(document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4'));

  if (toggle && header && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const updateScroll = function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (progress) {
      progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, ratio)) + ')';
    }

    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollTop > 420);
    }
  };

  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (revealNodes.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  if (tocLinks.length && headings.length) {
    headings.forEach(function (heading) {
      if (!heading.id) {
        heading.id = heading.textContent
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\u4e00-\u9fa5-]/g, '');
      }
    });

    const highlightActive = function (id) {
      tocLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    };

    const tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          highlightActive(entry.target.id);
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

    headings.forEach(function (heading) {
      tocObserver.observe(heading);
    });
  }

  const foxStage = document.querySelector('[data-fox-stage]');
  const foxScene = document.querySelector('[data-fox-scene]');
  const posterBook = document.querySelector('[data-poster-book]');
  const posterScene = document.querySelector('.poster-scene');
  const easterButtons = Array.from(document.querySelectorAll('[data-easter]'));
  const easterNote = document.querySelector('[data-easter-note]');
  const easterText = easterNote ? easterNote.querySelector('.poster-easter-text') : null;
  const foxCaption = document.querySelector('[data-fox-caption]');
  const titleChars = Array.from(document.querySelectorAll('.poster-title-char'));
  const memoryFrames = Array.from(document.querySelectorAll('[data-memory-random]'));
  let easterTimer = null;
  let foxTimer = null;

  if (foxStage && foxScene) {
    const foxDefaultText = foxCaption ? foxCaption.textContent : '';
    const foxMessages = [
      '狐狸轻轻摇了摇尾巴，像是在说：今天也继续做点有趣的东西吧。',
      '它把耳朵竖起来了，像是听见你在翻新的灵感纸片。',
      '这只小狐狸已经收下你的摸摸，尾巴开心地晃了一下。',
      '它悄悄眨了眨眼，像在替这页海报签一个温柔的小名。'
    ];

    const setFoxPose = function (rotateX, rotateY, shiftX, shiftY) {
      foxStage.style.setProperty('--fox-rotate-x', rotateX.toFixed(2) + 'deg');
      foxStage.style.setProperty('--fox-rotate-y', rotateY.toFixed(2) + 'deg');
      foxStage.style.setProperty('--fox-shift-x', shiftX.toFixed(1) + 'px');
      foxStage.style.setProperty('--fox-shift-y', shiftY.toFixed(1) + 'px');
    };

    setFoxPose(0, 0, 0, 0);

    foxStage.addEventListener('mousemove', function (event) {
      const rect = foxStage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      setFoxPose(py * -12, px * 18, px * 12, py * 8);
    });

    foxStage.addEventListener('mouseleave', function () {
      setFoxPose(0, 0, 0, 0);
    });

    foxStage.addEventListener('touchmove', function (event) {
      if (!event.touches.length) return;
      const rect = foxStage.getBoundingClientRect();
      const touch = event.touches[0];
      const px = (touch.clientX - rect.left) / rect.width - 0.5;
      const py = (touch.clientY - rect.top) / rect.height - 0.5;

      setFoxPose(py * -10, px * 14, px * 8, py * 6);
    }, { passive: true });

    foxStage.addEventListener('touchend', function () {
      setFoxPose(0, 0, 0, 0);
    });

    foxStage.addEventListener('click', function () {
      foxScene.classList.remove('is-excited');
      void foxScene.offsetWidth;
      foxScene.classList.add('is-excited');

      if (foxCaption) {
        foxCaption.textContent = foxMessages[Math.floor(Math.random() * foxMessages.length)];
        foxCaption.classList.add('is-active');
      }

      if (foxTimer) {
        window.clearTimeout(foxTimer);
      }

      foxTimer = window.setTimeout(function () {
        foxScene.classList.remove('is-excited');
        if (foxCaption) {
          foxCaption.textContent = foxDefaultText;
          foxCaption.classList.remove('is-active');
        }
      }, 2200);
    });
  }

  if (posterBook) {
    const setPosterPose = function (rotate, shiftX, shiftY) {
      posterBook.style.setProperty('--poster-rotate', rotate.toFixed(2) + 'deg');
      posterBook.style.setProperty('--poster-shift-x', shiftX.toFixed(1) + 'px');
      posterBook.style.setProperty('--poster-shift-y', shiftY.toFixed(1) + 'px');
    };

    setPosterPose(0, 0, 0);

    posterBook.addEventListener('mousemove', function (event) {
      const rect = posterBook.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      setPosterPose(px * 2.4, px * 7, py * 5);
    });

    posterBook.addEventListener('mouseleave', function () {
      setPosterPose(0, 0, 0);
    });
  }

  if (posterScene && easterNote && easterText && easterButtons.length) {
    const hideEasterNote = function () {
      easterNote.classList.remove('is-visible');
      if (easterTimer) {
        window.clearTimeout(easterTimer);
        easterTimer = null;
      }

      window.setTimeout(function () {
        if (!easterNote.classList.contains('is-visible')) {
          easterNote.hidden = true;
        }
      }, 220);
    };

    const showEasterNote = function (button) {
      const sceneRect = posterScene.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const message = button.getAttribute('data-easter') || '';
      const noteWidth = Math.min(240, Math.max(160, sceneRect.width * 0.24));
      const left = Math.min(
        sceneRect.width - noteWidth - 18,
        Math.max(18, buttonRect.left - sceneRect.left + buttonRect.width * 0.5 - noteWidth * 0.5)
      );
      const placeBelow = buttonRect.top - sceneRect.top < sceneRect.height * 0.42;
      const top = placeBelow
        ? buttonRect.bottom - sceneRect.top + 14
        : buttonRect.top - sceneRect.top - 86;

      easterText.textContent = message;
      easterNote.hidden = false;
      easterNote.style.left = left + 'px';
      easterNote.style.top = Math.max(18, Math.min(sceneRect.height - 110, top)) + 'px';

      window.requestAnimationFrame(function () {
        easterNote.classList.add('is-visible');
      });

      if (easterTimer) {
        window.clearTimeout(easterTimer);
      }

      easterTimer = window.setTimeout(hideEasterNote, 3200);
    };

    easterButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        showEasterNote(button);
      });
    });

    posterScene.addEventListener('mouseleave', function () {
      hideEasterNote();
    });

    document.addEventListener('click', function (event) {
      if (!easterNote.hidden && !posterScene.contains(event.target)) {
        hideEasterNote();
      }
    });

    window.addEventListener('resize', function () {
      hideEasterNote();
    });
  }

  if (titleChars.length) {
    const applyCharMotion = function (char) {
      const rotate = (Math.random() * 5 - 2.5).toFixed(2) + 'deg';
      const rise = -(0.035 + Math.random() * 0.045).toFixed(3) + 'em';
      const scale = (1.02 + Math.random() * 0.035).toFixed(3);
      const shiftX = (Math.random() * 0.04 - 0.02).toFixed(3) + 'em';

      char.style.setProperty('--char-rotate', rotate);
      char.style.setProperty('--char-rise', rise);
      char.style.setProperty('--char-scale', scale);
      char.style.setProperty('--char-shift-x', shiftX);
    };

    titleChars.forEach(function (char) {
      let revertTimer = null;

      char.addEventListener('mouseenter', function () {
        if (revertTimer) {
          window.clearTimeout(revertTimer);
          revertTimer = null;
        }

        applyCharMotion(char);
        char.classList.add('is-handwritten');
      });

      char.addEventListener('mouseleave', function () {
        if (revertTimer) {
          window.clearTimeout(revertTimer);
        }

        revertTimer = window.setTimeout(function () {
          char.classList.remove('is-handwritten');
        }, 420);
      });

      char.addEventListener('focus', function () {
        applyCharMotion(char);
        char.classList.add('is-handwritten');
      });

      char.addEventListener('blur', function () {
        char.classList.remove('is-handwritten');
      });
    });
  }

  if (memoryFrames.length) {
    memoryFrames.forEach(function (frame) {
      const rotate = (Math.random() * 10 - 5).toFixed(2) + 'deg';
      const shiftY = (Math.random() * 14 - 7).toFixed(2) + 'px';
      const scale = (0.96 + Math.random() * 0.08).toFixed(3);

      frame.style.setProperty('--memory-rotate', rotate);
      frame.style.setProperty('--memory-shift-y', shiftY);
      frame.style.setProperty('--memory-scale', scale);
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const parallaxNodes = [];

  if (posterBook) {
    parallaxNodes.push({ node: posterBook, depth: 16 });
  }

  Array.from(document.querySelectorAll('.poster-doodle')).forEach(function (node, index) {
    parallaxNodes.push({ node: node, depth: 10 + (index % 3) * 4 });
  });

  memoryFrames.forEach(function (node, index) {
    parallaxNodes.push({ node: node, depth: 14 + (index % 2) * 3 });
  });

  Array.from(document.querySelectorAll('.scrap-doodle')).forEach(function (node, index) {
    parallaxNodes.push({ node: node, depth: 12 + index * 4 });
  });

  Array.from(document.querySelectorAll('.scrap-card')).forEach(function (node, index) {
    parallaxNodes.push({ node: node, depth: 8 + (index % 4) * 2.5 });
  });

  Array.from(document.querySelectorAll('.scrap-note')).forEach(function (node, index) {
    parallaxNodes.push({ node: node, depth: 10 + index * 2 });
  });

  if (parallaxNodes.length) {
    let parallaxFrame = null;

    parallaxNodes.forEach(function (item) {
      item.current = 0;
      item.target = 0;
    });

    const setParallaxTarget = function () {
      const disableParallax = reducedMotion.matches || window.innerWidth < 781;

      parallaxNodes.forEach(function (item) {
        if (disableParallax) {
          item.target = 0;
          return;
        }

        const rect = item.node.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;
        const elementCenter = rect.top + rect.height * 0.5;
        const progress = (viewportCenter - elementCenter) / window.innerHeight;
        const clamped = Math.max(-1, Math.min(1, progress));

        item.target = clamped * item.depth;
      });

      if (!parallaxFrame) {
        parallaxFrame = window.requestAnimationFrame(renderParallax);
      }
    };

    const renderParallax = function () {
      let active = false;

      parallaxNodes.forEach(function (item) {
        item.current += (item.target - item.current) * 0.14;

        if (Math.abs(item.target - item.current) > 0.08) {
          active = true;
        } else {
          item.current = item.target;
        }

        item.node.style.setProperty('--scroll-parallax-y', item.current.toFixed(2) + 'px');
      });

      if (active) {
        parallaxFrame = window.requestAnimationFrame(renderParallax);
      } else {
        parallaxFrame = null;
      }
    };

    setParallaxTarget();
    window.addEventListener('scroll', setParallaxTarget, { passive: true });
    window.addEventListener('resize', setParallaxTarget);

    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', setParallaxTarget);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(setParallaxTarget);
    }
  }
})();
