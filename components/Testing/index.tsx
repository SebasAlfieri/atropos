import React from 'react';
import s from './Testing.module.css';
import { motion } from 'framer-motion';
import 'atropos/css';
import Atropos from 'atropos/react';
import Image from 'next/image';

const Testing = () => {
  return (
    <div className={s.container}>
      {/* Atropos */}
      <Atropos
        className={s.container__atropos}
        shadow={false}
        alwaysActive={true}
        highlight={false}
        commonOrigin={true}
        rotateXMax={20}
        rotateYMax={10}
        duration={1000}>
        <Atropos
          className={s.container__atropos__logo}
          shadow={false}
          alwaysActive={true}
          commonOrigin={true}
          highlight={false}>
          <motion.div
            whileInView={{
              scale: [0.8, 1],
              transition: { duration: 1, repeat: Infinity, repeatType: 'mirror' }
            }}>
            <Image
              className={s.container__atropos__logo}
              src={'/images/logo.png'}
              alt="aa"
              width={600}
              height={300}
            />
          </motion.div>
        </Atropos>
        <Atropos
          className={s.container__atropos__ruffles__a}
          shadow={false}
          alwaysActive={true}
          commonOrigin={true}
          highlight={false}>
          <motion.div
            initial={{ rotateZ: 0 }}
            animate={{
              opacity: 1,
              rotateZ: 20,
              transition: { duration: 2, repeat: Infinity, repeatType: 'mirror' }
            }}>
            <Image src={'/images/ruffles.png'} alt="aa" width={300} height={300} />
          </motion.div>
        </Atropos>
        <Atropos
          className={s.container__atropos__ruffles__b}
          shadow={false}
          alwaysActive={true}
          commonOrigin={true}
          highlight={false}>
          <motion.div
            initial={{ rotateZ: 0 }}
            animate={{
              opacity: 1,
              rotateZ: 20,
              transition: { duration: 2, repeat: Infinity, repeatType: 'mirror' }
            }}>
            <Image src={'/images/ruffles.png'} alt="aa" width={300} height={300} />
          </motion.div>
        </Atropos>
        <Atropos
          className={s.container__atropos__ruffles__c}
          shadow={false}
          alwaysActive={true}
          commonOrigin={true}
          highlight={false}>
          <motion.div
            initial={{ rotateZ: 0 }}
            animate={{
              opacity: 1,
              rotateZ: 20,
              transition: { duration: 2, repeat: Infinity, repeatType: 'mirror' }
            }}>
            <Image src={'/images/ruffles.png'} alt="aa" width={300} height={300} />
          </motion.div>
        </Atropos>
        <Atropos
          className={s.container__atropos__ruffles__d}
          shadow={false}
          alwaysActive={true}
          commonOrigin={true}
          highlight={false}>
          <motion.div
            initial={{ rotateZ: 0 }}
            animate={{
              opacity: 1,
              rotateZ: 20,
              transition: { duration: 2, repeat: Infinity, repeatType: 'mirror' }
            }}>
            <Image src={'/images/ruffles.png'} alt="aa" width={300} height={300} />
          </motion.div>
        </Atropos>
      </Atropos>
      <button onClick={() => alert('aaa')}>CONECTA A SPOTIFY</button>
    </div>
  );
};

export default Testing;
