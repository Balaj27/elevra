import './design.css';
import './globals.css';
import './motion.css';
import './mobile-navigation.css';

export const metadata = {
  title: 'Elevra | Business Consulting for Strategy & Growth',
  description: 'Elevra helps ambitious businesses find clarity, build smarter strategies, and turn complex challenges into sustainable growth. Start a conversation today.',
};

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
