import { motion } from "framer-motion";

const kbdClasses =
  "pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex";

export default function ControlsOverlay() {
  return (
   
        <motion.div
                    className="absolute left-14 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
           
            <ul className="space-y-4 text-gray-600 text-sm list-disc list-inside">
            
              <li className="flex flex-row gap-5">
                <div className="flex items-center ">
                  <kbd className={kbdClasses}>=</kbd>
                  <span className="text-xs text-gray-500">/</span>
                  <kbd className={kbdClasses}>+</kbd>
                </div>
                <div>Increase zoom by 1</div>
              </li>

      
              <li className="flex flex-row gap-5">
                <div className="flex items-center space-x-1">
                  <kbd className={kbdClasses}>Shift</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className={kbdClasses}>=</kbd>
                  <span className="text-xs text-gray-500">/</span>
                  <kbd className={kbdClasses}>Shift</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className={kbdClasses}>+</kbd>
                </div>
                <span>Increase zoom by 2</span>
              </li>


              <li className="flex flex-row gap-5">
                <div className="flex items-center">
                  <kbd className={kbdClasses}>-</kbd>
                </div>
                <span>Decrease zoom by 1</span>
              </li>


              <li className="flex flex-row gap-5">
                <div className="flex items-center space-x-1">
                  <kbd className={kbdClasses}>Shift</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className={kbdClasses}>-</kbd>
                </div>
                <span>Decrease zoom by 2</span>
              </li>


              <li className="flex flex-row gap-5">
                <div className="flex items-center space-x-1">
                  <kbd className={kbdClasses}>←</kbd>
                  <kbd className={kbdClasses}>↑</kbd>
                  <kbd className={kbdClasses}>→</kbd>
                  <kbd className={kbdClasses}>↓</kbd>
                </div>
                <span>Pan by 100 px</span>
              </li>

    
              <li className="flex flex-row gap-5">
                <div className="flex items-center space-x-1">
                  <kbd className={kbdClasses}>Shift</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className={kbdClasses}>→</kbd>
                </div>
                <span>Increase rotation by 15°</span>
              </li>

              
              <li className="flex flex-row gap-5">
                <div className="flex items-center space-x-1">
                  <kbd className={kbdClasses}>Shift</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className={kbdClasses}>←</kbd>
                </div>
                <span>Decrease rotation by 15°</span>
              </li>

          
              <li className="flex flex-row gap-5">
                <div className="flex items-center space-x-1">
                  <kbd className={kbdClasses}>Shift</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className={kbdClasses}>↑</kbd>
                </div>
                <span>Increase pitch by 10°</span>
              </li>

    
              <li className="flex flex-row gap-5">
                <div className="flex items-center space-x-1">
                  <kbd className={kbdClasses}>Shift</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className={kbdClasses}>↓</kbd>
                </div>
                <span>Decrease pitch by 10°</span>
              </li>
            </ul>
        
          </div>
        </motion.div>
     
     
  );
}
