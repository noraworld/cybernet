[].forEach.call(document.querySelectorAll('.mastodon-intent-btn'), function (el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    window.open(e.target.href, 'mastodon-intent', 'width=400,height=400,top=' + (screen.height - 400) / 2 + ',left=' + (screen.width - 400) / 2 +',resizable=no,menubar=no,status=no,scrollbars=yes');
  });
});

var xhr = new XMLHttpRequest();
xhr.open('POST', '/api/v1/fingerprint', true);
xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
xhr.send('user_agent=' + navigator.userAgent + '&referrer=' + document.referrer + '&screen_size=' + screen.width + 'x' + screen.height);
