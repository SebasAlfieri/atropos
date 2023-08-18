import React from 'react';
import { motion } from 'framer-motion';
import s from './ResultContainer.module.css';
import IpTesting from 'components/IpTesting';
// import { Testing } from '@/components';

const ResultContainer = () => {
  return (
    <motion.div className={s.container}>
      <motion.div className={s.container}>
        <IpTesting />
      </motion.div>
    </motion.div>
  );
};

export default ResultContainer;
