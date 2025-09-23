"use client";

import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggler";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTimer } from "@/lib/timer";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Добавляем/убираем тень у шапки при скролле
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Таймер
  const { time } = useTimer(siteConfig.timeSec);
  const days = Math.floor(time / (24 * 3600));
  const hours = Math.floor((time % (24 * 3600)) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <>
      {/* Основная обёртка */}
      <main className="bg-dark-hero text-white min-h-screen flex flex-col relative">
        {/* ШАПКА */}
        <header
          className={cn(
            "fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between",
            "glass-header transition-shadow duration-300",
            isScrolled ? "shadow-lg" : "shadow-none"
          )}
        >
          <div className="flex items-center space-x-4">
            {/* Логотип/иконка */}
            <h1 className="text-2xl font-semibold uppercase tracking-wide">
              {siteConfig.tokenShortName} Hunt
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {siteConfig.twitterUrl && (
              <Link href={siteConfig.twitterUrl} target="_blank" rel="noreferrer">
                <div className={cn(buttonVariants({ variant: "ghost" }), "w-200")}>
                  <Icons.twitter className="h-5 w-5 fill-white" />
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Отступ под шапку */}
        <div className="h-16 w-full shrink-0" />

        {/* ГЛАВНЫЙ БЛОК (Hero-секция) */}
        <section
          data-aos="fade-up" // ВМЕСТО animate-fadeInUp
          className={cn(
            "px-6 pt-10 pb-16 max-w-screen-2xl mx-auto w-full flex flex-col md:flex-row",
            "items-center md:items-start md:space-x-10 justify-center"
          )}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10">
            {/* Левая колонка */}
            <div className="max-w-xl mb-12 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                JOIN THE HUNT FOR
              </h2>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-3 text-primary-foreground">
                $1,498,357
              </h1>
              <h3 className="text-3xl font-bold mb-6 text-primary-foreground/80">
                IN {siteConfig.tokenShortName} TOKENS¹
              </h3>
              <p className="text-lg md:text-xl leading-relaxed text-white/80 mb-6">
                Get points when you buy crypto, swap, top up, and more — then
                turn them into {siteConfig.tokenShortName} Tokens. Boost your
                points with multipliers to win big.
              </p>

              <h2 className="font-semibold mb-2 text-xl">Step 1</h2>
              <p className="text-sm md:text-base text-white/80 mb-3">
                Connect to the airdrop and receive your first reward.
              </p>
              <Button className="h-12 w-64 text-lg font-semibold mb-6 interact-button">
                Connect wallet
              </Button>

              <h2 className="font-semibold mb-2 text-xl text-white/60">Step 2</h2>
              <p className="text-sm md:text-base text-white/50 mb-3">
                Follow the steps to earn additional rewards.
              </p>
              <Button
                variant="secondary"
                className="h-12 w-64 text-lg font-light flex items-center justify-center interact-button"
              >
                Join the Hunt <ArrowTopRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Правая колонка с изображением */}
            <div className="w-full max-w-xl">
              <img
                src={siteConfig.mainImageUrl}
                alt="Main Artwork"
                className="levitate rounded-xl w-full"
              />
            </div>
          </div>
        </section>

        {/* Примерные блоки скролла */}
        <section data-aos="fade-up" className="px-6 py-16 max-w-screen-lg mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Participate?</h2>
        <p className="text-base md:text-lg text-white/80 leading-relaxed">
        Take part in an exclusive opportunity to earn {siteConfig.tokenShortName} Tokens.
        By joining, you unlock access to rewards, multipliers, and exciting challenges.
        The more you engage, the higher your potential earnings.
        </p>
        </section>

        <section data-aos="fade-up" className="px-6 py-16 max-w-screen-lg mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Features</h2>
        <p className="text-base md:text-lg text-white/80 leading-relaxed mb-4">
        Our platform offers a seamless experience with instant transactions,
        top-tier security, and transparent reward tracking.
        </p>
        <p className="text-base md:text-lg text-white/80 leading-relaxed">
        Whether you're swapping, staking, or referring friends,
        you can maximize your benefits with our integrated system.
        Start your journey today and see how you can grow your earnings effortlessly.
        </p>
        </section>


        {/* Блок "Sign up for updates" и "Follow us" */}
        <section
          data-aos="fade-up"
          className="px-6 py-16 max-w-screen-xl mx-auto w-full"
        >
          <div className="glass-content p-6 md:p-8 rounded-xl shadow-xl">
            <div className="flex flex-col md:flex-row md:space-x-10">
              {/* Sign up */}
              <div className="mb-8 md:mb-0 md:w-1/2">
                <h3 className="font-bold text-xl mb-2">Sign up for updates</h3>
                <form className="flex">
                  <input
                    type="email"
                    className="w-full rounded-l-md p-3 text-black focus:outline-none"
                    placeholder="Enter your email"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-5 rounded-r-md hover:bg-primary/90 text-lg"
                  >
                    ➔
                  </button>
                </form>
              </div>
              {/* Follow us */}
              <div className="md:w-1/2">
                <h3 className="font-bold text-xl mb-2">Follow us</h3>
                <div className="flex space-x-4">
                  {siteConfig.twitterUrl && (
                    <Link
                      href={siteConfig.twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-12 h-12 px-0"
                        )}
                      >
                        <Icons.twitter className="w-6 h-6 fill-white" />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Блоки ссылок (Products, Company, Resources, Legal) */}
        <section data-aos="fade-up" className="px-6 py-12 max-w-screen-xl mx-auto">
          <div className="flex mb-8 space-x-10">
            <div className="w-1/2 md:w-1/4 mb-6">
              <h4 className="font-bold text-lg mb-3">Products</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <a href="#" className="footer-link">
                    Buy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Earn
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Exchange
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Borrow
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/4 mb-6">
              <h4 className="font-bold text-lg mb-3">Company</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <a href="#" className="footer-link">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Licenses
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Nexo Prime
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/4 mb-6">
              <h4 className="font-bold text-lg mb-3">Resources</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <a href="#" className="footer-link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Media Center
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Status Center
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/4 mb-6">
              <h4 className="font-bold text-lg mb-3">Legal</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <a href="#" className="footer-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Services Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Cookies Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Футер-дисклеймер */}
        <footer data-aos="fade-up" className="px-6 py-12 border-t border-border/30 mb-10">
          <div className="max-w-screen-md mx-auto text-sm text-white/70 leading-relaxed">
            <p>
              The equivalent USD value of the campaign pool of 10,000,000 {siteConfig.tokenShortName} Tokens...
            </p>
            <br />
            <p>
              Citizens or residents of the USA, UK, and Canada are not eligible...
            </p>
            <br />
            <p>
              For the full terms and conditions of the {siteConfig.tokenName} Hunt campaign...
            </p>
            <br />
            <p>
              All or part of the Nexo Services, some features thereof...
            </p>
            <br />
            <p>
              Copyright 2024 {siteConfig.organisation}. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      {/* ТАЙМЕР внизу (fixed) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 glass-header z-50 border-t border-border/30 flex items-center justify-center">
        <p className="text-xl md:text-2xl font-semibold">
          Time Left:{" "}
          <span className="ml-1 font-bold text-pink-400">
            {days}d : {hours}h : {minutes}m : {seconds}s
          </span>
        </p>
      </div>
    </>
  );
}
