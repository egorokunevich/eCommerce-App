import Toastify from 'toastify-js';

export enum ToastColors {
  Red,
  Blue,
  Green,
}

export function showToastMessage(message: string, color: ToastColors = ToastColors.Red): void {
  let gradient: string;
  let shadow: string;
  switch (color) {
    case ToastColors.Red:
      gradient = `#ff3c16, #ff8400`;
      shadow = `255, 60, 22`; // Color in RGB
      break;

    case ToastColors.Blue:
      gradient = `#73a5ff, #5477f5`;
      shadow = `77, 96, 232`;
      break;

    case ToastColors.Green:
      gradient = `#0be433, #5cb433`;
      shadow = `92, 180, 44`;
      break;

    default:
      gradient = `#73a5ff, #5477f5`;
      shadow = `77, 96, 232`;
      break;
  }
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: `linear-gradient(135deg, ${gradient})`,
      boxShadow: `0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(${shadow}, 0.3)`,
    },
  }).showToast();
}
