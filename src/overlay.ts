export function create(): Promise<void> {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '10',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)',
      cursor: 'pointer',
      fontFamily: 'system-ui, sans-serif',
      userSelect: 'none',
      transition: 'opacity 0.4s',
    });

    const btn = document.createElement('span');
    btn.textContent = 'Click to start';
    Object.assign(btn.style, {
      color: '#fff',
      fontWeight: '600',
      fontSize: '1.5rem',
      letterSpacing: '0.04em',
      padding: '1em 2.5em',
      border: '2px solid #fff',
      borderRadius: '999px',
    });

    const hint = document.createElement('p');
    hint.textContent = '(audio will play)';
    Object.assign(hint.style, {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.85rem',
      marginTop: '1rem',
      letterSpacing: '0.02em',
    });

    overlay.append(btn, hint);
    document.body.append(overlay);

    overlay.addEventListener('click', () => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 400);
    });
  });
}

export function createRestartButton(): Promise<void> {
  return new Promise(resolve => {
    const btn = document.createElement('button');
    btn.textContent = 'Restart';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: '10',
      color: '#fff',
      background: 'transparent',
      fontWeight: '600',
      fontSize: '1.2rem',
      letterSpacing: '0.04em',
      padding: '1em 2.2em',
      border: '2px solid #fff',
      borderRadius: '999px',
      cursor: 'pointer',
      fontFamily: 'system-ui, sans-serif',
      transform: 'translateY(100px)',
      opacity: '0',
      transition: 'transform 0.5s ease, opacity 0.5s ease',
    });
    document.body.append(btn);
    btn.offsetHeight;
    btn.style.transform = 'translateY(0)';
    btn.style.opacity = '1';

    btn.addEventListener('click', () => {
      btn.remove();
      resolve();
    });
  });
}
