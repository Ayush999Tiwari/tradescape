# Tradescape — Trader Risk Dashboard
This is a clean, responsive dashboard built to help traders quickly understand their account health, track their performance, and most importantly, see how close they are to violating their account rules.
Built with React, TypeScript, and Tailwind CSS.

# How to Run the Project

Clone the repository and navigate into the project folder.
1.) Install the dependencies by doing  npm install and 
2.)Start the local development server:
   npm run dev

 # Open your browser and go to the local host link provided in the terminal (usually http://localhost:5173).
# 🛠️ What I Built

The dashboard takes raw trade data and dynamically calculates everything on the fly (no hardcoded numbers). It includes:
Account Overview: Starting balance, current balance, max drawdown limit, and daily loss limit.
Trading Performance: Total P&L, win rate, winning/losing trade counts, and largest win/loss.
Risk Indicator: The core feature. It visually shows current drawdown and daily loss against their respective limits. It uses a clear color-coded system (Green/Yellow/Red) to instantly tell the trader if they are Safe, Approaching Limit, or At Risk.

# ✨ Additional Feature: The Equity Curve
What it is: A visual line chart that plots the account balance after every single trade.
Why I added it: A trader's current balance only tells them where they are right now, but it doesn't tell them how they got there. The equity curve helps a trader spot patterns—like whether their profits are steady and consistent, or if they are relying on one lucky massive win to stay in the green. It turns raw numbers into a visual story of their trading journey
.
# 🧠 Product Questions
1. What is drawdown in trading?
Drawdown is the measure of decline from a historical peak in an account's balance. Simply put, it’s how much your account has dropped from its highest point. It’s a way to measure the "pain" or risk you've experienced during a losing streak.
2. Why do you think a trader would care about their remaining drawdown rather than just their current P&L?
Current P&L tells you how much money you've made or lost today, but it doesn't tell you how much runway you have left. Remaining drawdown is your survival metric. If a trader is up $5,000 in P&L but has already used 90% of their max drawdown limit from a previous losing streak, they are actually in massive danger of failing the evaluation. P&L is about profit; remaining drawdown is about staying alive in the game.
3. If you had another day to work on this dashboard, what would you improve?
I would add customizable risk alerts. Instead of just looking at the dashboard, a trader could set up notifications (e.g., "Alert me when I hit 75% of my daily loss limit"). I'd also love to add a feature to filter the trade history by specific assets (like only showing BTC trades) to help them analyze their performance per coin.
