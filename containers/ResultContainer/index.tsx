import React from 'react';
import { motion } from 'framer-motion';
import s from './ResultContainer.module.css';
import { Testing } from '@/components';

const ResultContainer = () => {
  return (
    <motion.div className={s.container}>
      <motion.div className={s.container}>
        <Testing />
      </motion.div>
    </motion.div>
  );
};

export default ResultContainer;
