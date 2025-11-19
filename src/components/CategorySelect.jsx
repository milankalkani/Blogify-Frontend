import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Tag } from "lucide-react";

const categories = [
    "Technology",
    "Health",
    "Lifestyle",
    "Travel",
    "Food",
    "Education",
    "Business",
    "Entertainment",
    "Fitness",
];

const GlassCategorySelect = ({ onChange }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        setSelected(value);
        onChange(value);
        setOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Select Button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !(prev))}
                className="
          w-full flex items-center justify-between 
          px-4 py-3 rounded-xl 
          bg-white/40 border border-white/30 
          shadow-inner backdrop-blur-xl
          text-gray-700 font-medium
          hover:bg-white/50 transition
        "
            >
                <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-600" />
                    {selected || "Select Category"}
                </span>
                <ChevronDown
                    className={`w-5 h-5 transition ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="
              absolute left-0 top-full z-50 w-full mt-2
              bg-white/70 backdrop-blur-2xl border border-white/40
              shadow-xl rounded-2xl
              max-h-56 overflow-auto
            "
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleSelect(cat)}
                                className="
                  w-full text-left px-4 py-3 
                  hover:bg-white/60 transition 
                  text-gray-700 font-medium
                "
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlassCategorySelect;
