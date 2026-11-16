
import React from 'react';

const MobileShowcase = () => {
    return (
        <section className="relative min-h-187.5 flex items-center justify-center bg-(--color-dark-gray) overflow-hidden py-20">

            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <h2 className="text-[20vw] sm:text-[22vw] lg:text-[19vw] font-extrabold tracking-tighter text-(--color-blue)/10 whitespace-nowrap">
                    ANDCHAT
                </h2>
            </div>

            {/* Mobile Mockup */}
            <div className="relative z-10 w-48.75 h-100">

                {/* Phone Frame */}
                <div className="relative bg-black rounded-[3rem] p-2.5 shadow-2xl shadow-black/30 h-full">

                    {/* Screen */}
                    <div className="relative overflow-hidden rounded-[2.4rem] bg-white w-full h-full">

                        <img
                            src="/images/mobile-app.png"
                            alt="AndChat mobile application preview"
                            className="w-full h-full object-cover"
                        />

                        {/* Notch */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />

                    </div>

                    {/* Side Button */}
                    <div className="absolute top-28 -right-0.75 w-0.75 h-16 bg-gray-700 rounded-r-full" />

                </div>
            </div>

        </section>
    );
};

export default MobileShowcase;
