import { motion } from "framer-motion";
import { useState } from "react";

export default function AnimList() {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  return (
    <motion.div layoutRoot>
      <button
        onClick={() => {
          setCards([...cards].sort((a, b) => (0.5 > Math.random() ? 1 : -1)));
        }}
      >
        Suffle
      </button>
      <ul>
        {cards.map((c, index) => {
          return (
            <motion.div key={`anime-list-item-${index}`} layout>
              {c.title}
            </motion.div>
          );
        })}
      </ul>
    </motion.div>
  );
}

const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "SOX compliance checklist", id: "2", column: "backlog" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];
