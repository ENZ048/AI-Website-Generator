import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import * as FiIcons from "react-icons/fi";
import { footer } from "../data/siteContent";

export default function FooterNew({ data }) {
	// Use data from props with fallback to static data
	const footerData = data || footer;
	
	const phrases = ["your project", "your idea", "your vision"];
	const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
	const [currentText, setCurrentText] = useState("");
	const [isTyping, setIsTyping] = useState(true);

	useEffect(() => {
		if (isTyping) {
			const currentPhrase = phrases[currentPhraseIndex];
			if (currentText.length < currentPhrase.length) {
				const timeout = setTimeout(() => {
					setCurrentText(currentPhrase.slice(0, currentText.length + 1));
				}, 100); // Typing speed: 100ms per character
				return () => clearTimeout(timeout);
			} else {
				// Finished typing, wait before starting to delete
				const timeout = setTimeout(() => {
					setIsTyping(false);
				}, 1500); // Wait 1.5 seconds before deleting
				return () => clearTimeout(timeout);
			}
		} else {
			// Deleting text
			if (currentText.length > 0) {
				const timeout = setTimeout(() => {
					setCurrentText(currentText.slice(0, -1));
				}, 50); // Deleting speed: 50ms per character
				return () => clearTimeout(timeout);
			} else {
				// Finished deleting, move to next phrase
				setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
				setIsTyping(true);
			}
		}
	}, [currentText, currentPhraseIndex, isTyping, phrases]);

	// Get the icon component dynamically
	const LogoIcon = FiIcons[footerData.logo];

	return (
		<footer className="bg-custom-background border-t border-white/10">
			{/* Main Footer Content */}
			<div className="py-12 sm:py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
						{/* Left Column - Branding and Call to Action */}
						<div className="sm:col-span-2 lg:col-span-1 space-y-6 sm:space-y-8">
							{/* Logo */}
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
									<LogoIcon className="text-white text-lg" />
								</div>
								<span className="text-white text-lg sm:text-xl font-semibold">{footerData.companyName}</span>
							</div>
							
							{/* Tagline */}
							<p className="text-pink-400 text-sm font-medium uppercase tracking-wide">
								{footerData.branding.tagline}
							</p>
							
							{/* Main CTA with Typing Animation */}
							<div className="space-y-2">
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
									{footerData.branding.heading.prefix}{" "}
									<span className="text-pink-400 min-w-[180px] sm:min-w-[200px] inline-block">
										{currentText}
										<span className="typing-cursor">|</span>
									</span>
								</h3>
							</div>
							
							{/* Connect CTA */}
							<div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer group">
								<span className="text-sm font-medium">{footerData.branding.connect}</span>
								<FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
							</div>
						</div>

						{/* Right Columns - Navigation Links */}
						<div className="sm:col-span-2 lg:col-span-3">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
								{/* Services Column */}
								<div className="space-y-3 sm:space-y-4">
									<h4 className="text-white font-semibold text-base sm:text-lg">Services</h4>
									<ul className="space-y-2 sm:space-y-3">
										{footerData.navigation.services.map((service, index) => (
											<li key={index}>
												<a href="#" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base">
													{service}
												</a>
											</li>
										))}
									</ul>
								</div>

								{/* Company Column */}
								<div className="space-y-3 sm:space-y-4">
									<h4 className="text-white font-semibold text-base sm:text-lg">Company</h4>
									<ul className="space-y-2 sm:space-y-3">
										{footerData.navigation.company.map((item, index) => (
											<li key={index}>
												<a href="#" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base">
													{item}
												</a>
											</li>
										))}
									</ul>
								</div>

								{/* Support Column */}
								<div className="space-y-3 sm:space-y-4">
									<h4 className="text-white font-semibold text-base sm:text-lg">Support</h4>
									<ul className="space-y-2 sm:space-y-3">
										{footerData.navigation.support.map((item, index) => (
											<li key={index}>
												<a href="#" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base">
													{item}
												</a>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Section - Copyright and Legal Links */}
			<div className="border-t border-white/10 py-4 sm:py-6">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						{/* Copyright */}
						<div className="text-white/60 text-xs sm:text-sm text-center sm:text-left">
							Copyright © 2025{" "}
							<a 
								href="https://troikatech.in/" 
								target="_blank" 
								rel="noopener noreferrer"
								className="hover:text-white transition-colors duration-200"
							>
								Troika Tech
							</a>
						</div>
						
						{/* Legal Links */}
						<div className="flex items-center gap-4 sm:gap-6 text-white/60 text-xs sm:text-sm">
							{[
								"Terms of Use",
								"Privacy Policy",
								"Refund Policy"
							].map((item, index) => (
								<a key={index} href="#" className="hover:text-white transition-colors duration-200">
									{item}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
