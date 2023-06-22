import { useState } from 'react';
import { DraggableEventHandler, DraggableProps } from 'react-draggable';

/** Hook to handle drag gesture, and dismiss an element based on its position */
export function useDissmissable<T extends HTMLElement | undefined>(
  ref: React.MutableRefObject<T> | undefined,
  onDismiss: () => void
): Partial<DraggableProps> & { opacity?: number } {
  const [x, setX] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const onStop: DraggableEventHandler = () => {
    if (!ref?.current || !x) return;
    if (Math.abs(x) < ref.current.offsetWidth / 2) {
      setX(0);
      setOpacity(1);
    } else {
      onDismiss();
    }
  };
  const onDrag: DraggableEventHandler = (_ev, data) => {
    if (!ref?.current) return;
    setX(data.x || 0);
    setOpacity(1 - Math.abs(data.x) / ref.current.offsetWidth);
  };

  return {
    position: {
      x,
      y: 0,
    },
    opacity,
    onDrag,
    onStop,
    axis: 'x',
  };
}
