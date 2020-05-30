import copyToClipboard from 'copy-to-clipboard';

export default function share(customShareText, path = location.pathname) {
  const shareLink = `${location.origin}${path}`;

  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=${encodeURIComponent(customShareText || '')}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${customShareText || ''}\n${shareLink}`)}`;
  const emailLink = `mailto:yourfriend@gmail.com?body=${encodeURIComponent(`${customShareText || ''}\n${shareLink}`)}`;

  function onCopy() {
    copyToClipboard(shareLink);
  }

  return {
    facebookLink,
    twitterLink,
    emailLink,
    onCopy,
  };
}
