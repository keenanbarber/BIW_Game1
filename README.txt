{\rtf1\ansi\ansicpg1252\cocoartf1504\cocoasubrtf830
{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww14080\viewh8820\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 README file for the Bejeweled-like game. \
================================\
DESCRIPTION: This game was made as part of Keenan Barber\'92s internship. \
The goal was to make a game that can be reskinned that will also work on both \
mobile and desktop browsers. \
\
MODIFYING THE JSON FILE\
============================================\
	DO NOT modify any keys unless mentioned below\
\
	\'93game_details\'94 \
		o name ________________ This is the player\'92s name to be used by the game. \
		o reward _______________ What the player is rewarded by playing the game. \
		o date_played ___________ The date that the game is being played. \
		o high_score ____________ The high score pulled from somewhere to tell the player \
							if they beat it. \
		o desktop_min_width\
		   desktop_min_height \
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 		   desktop_max_width \
		   desktop_max_height ____ The minimum/maximum dimensions of the game \
							size when playing on desktop browsers. \
		o game_duration _________ The amount of time the player is allowed to play the game. \
		o board_rows ____________ The amount of rows on the board of the game. \
\
\'85}