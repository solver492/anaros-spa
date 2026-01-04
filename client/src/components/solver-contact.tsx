import { useState } from 'react';
import './solver-contact.css';
import { useToast } from "@/hooks/use-toast";
import { X, Send } from "lucide-react";

interface SolverContactProps {
    onClose: () => void;
}

export function SolverContact({ onClose }: SolverContactProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    // Form Data
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const handleFlipBack = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
    };

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!name.trim()) {
            toast({
                title: "Oups !",
                description: "Dites-moi comment vous vous appelez sur l'enveloppe 😉",
                variant: "destructive"
            });
            return;
        }
        setIsOpen(true);
    };

    const handleCloseLetter = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
    };

    const handleSend = () => {
        if (!message.trim()) {
            toast({ description: "L'enveloppe est vide ? Écrivez-moi un petit mot !" });
            return;
        }

        const fullMessage = `*Nouveau Message de ${name}*\n\n*Contact:*\nWhatsApp: ${whatsapp}\nEmail: ${email}\n\n*Message:*\n${message}`;
        const encodedMessage = encodeURIComponent(fullMessage);
        const whatsappUrl = `https://wa.me/33773163772?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        toast({
            title: "Redirection vers WhatsApp...",
            description: "Votre message est prêt à être envoyé !",
            duration: 3000,
        });

        // Close animation sequence
        setIsOpen(false);
        setTimeout(() => setIsFlipped(false), 800);
        setTimeout(() => onClose(), 1600);
    };

    return (
        <div className="solver-overlay">
            {/* Close modal button outside the 3D context often helps, but template has it on overlay or separate */}
            <div className="solver-close-modal" onClick={onClose}>
                <X size={24} />
            </div>

            <div className="solver-container">
                <div className={`solver-form ${isFlipped ? 'flipped' : ''}`}>

                    {/* FRONT FACE */}
                    <div className="front">
                        <div className="solver-stamp">
                            <img src="/stamp.png" alt="Stamp" />
                        </div>
                        <div className="solver-info">
                            <h2>Contact info</h2>
                            <p>DigitalSolverLand</p>
                            <p>digitalsolverland@gmail.com</p>
                            <p>+33 7 73 16 37 72</p>
                        </div>
                        <a className="solver-flip-btn" onClick={handleFlip}>
                            Drop me a line !
                        </a>
                    </div>

                    {/* BACK FACE */}
                    <div className="back">

                        {/* The Letter (Now visually behind the bottom part, handled by z-index/order) */}
                        {/* Note: In CSS, sibling order matters for 3D stacking contexts */}

                        {/* THE LID (Top Flap) */}
                        <div className={`solver-lid-container ${isOpen ? 'open' : ''}`}>
                            <div className="solver-lid-flip">
                                <div className="front">
                                    <div className="solver-lid-inputs">
                                        <div className="solver-input-group">
                                            <label>Your Name :</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="solver-input-group">
                                            <label>Your WhatsApp :</label>
                                            <input
                                                type="text"
                                                value={whatsapp}
                                                onChange={(e) => setWhatsapp(e.target.value)}
                                                placeholder="+33"
                                            />
                                        </div>
                                        <div className="solver-input-group">
                                            <label>Your Email :</label>
                                            <input
                                                type="text"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <a className="solver-open-action" onClick={handleOpen}>
                                        Open
                                    </a>
                                </div>
                                <div className="back"></div>
                            </div>
                        </div>

                        {/* THE LETTER */}
                        <div className="solver-letter">
                            <div className="solver-letter-content">
                                <a className="solver-letter-close" onClick={handleCloseLetter}>Close</a>
                                <h3>Salut DigitalSolver,</h3>
                                <p>C’est pour une mise à jour qu’on veut faire, et on t’offrira évidemment un café.</p>
                                <textarea
                                    placeholder="Your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button className="solver-send-btn" onClick={handleSend}>
                                    Send
                                </button>
                            </div>
                        </div>

                        {/* BOTTOM PART (Body of envelope back) */}
                        <div className="solver-top">
                            <a className="solver-flip-back-action" onClick={handleFlipBack}>Flip</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
