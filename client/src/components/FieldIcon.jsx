import { motion } from 'framer-motion';

/**
 * Animated leading icon that disappears when the field has value.
 * Usage: <FieldIcon show={!value}><Mail className="h-5 w-5" /></FieldIcon>
 */
export default function FieldIcon({ show, children }) {
  return (
    <motion.span
      className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"
      initial={false}
      animate={
        show
          ? { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }
          : { opacity: 0, x: -6, scale: 0.98, filter: 'blur(1px)' }
      }
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.span>
  );
}
