export const list = {
  visible: {
    x: [-1000, 0],
    transition: {
      delay: 0.2,
      when: 'beforeChildren',
      staggerChildren: 0.2
    }
  },
  hidden: {
    transition: {
      when: 'afterChildren'
    }
  }
};

export const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 }
};
export const subtitle = {
  visible: {
    x: [-1000, 0],
    transition: {
      delay: 0.7,
      when: 'beforeChildren',
      staggerChildren: 0.4
    }
  },
  hidden: {
    transition: {
      when: 'afterChildren'
    }
  }
};
