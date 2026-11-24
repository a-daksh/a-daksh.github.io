// Site-wide settings. Content (jobs, projects, news, ...) lives in /content as markdown.
// The contact email is deliberately not here: see src/utils/email.js (kept out of the page source).
module.exports = {
  // Icons exist for: GitHub, Linkedin, Twitter, Instagram (see src/components/icons/icon.js).
  socialMedia: [
    { name: 'Linkedin', url: 'https://www.linkedin.com/in/daksh-adhar/' },
    { name: 'GitHub', url: 'https://github.com/a-daksh' },
    { name: 'Twitter', url: 'https://twitter.com/DakshAdhar' },
  ],

  // Top navigation; each url points at a section id on the home page.
  navLinks: [
    { name: 'About', url: '/#about' },
    { name: 'Experience', url: '/#jobs' },
    { name: 'Skills', url: '/#skills' },
    { name: 'Projects', url: '/#featured' },
    { name: 'Publications', url: '/#publications' },
    { name: 'Contact', url: '/#contact' },
  ],

  // Settings for the "fade up on scroll" effect (src/utils/reveal.js).
  revealConfig: (delay = 200) => ({
    delay, // ms
    distance: 20, // px
    duration: 500, // ms
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  }),
};
