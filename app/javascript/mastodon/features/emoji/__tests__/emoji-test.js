import emojify from '../emoji';

describe('emoji', () => {
  describe('.emojify', () => {
    it('ignores unknown shortcodes', () => {
      expect(emojify(':foobarbazfake:')).toEqual(':foobarbazfake:');
    });

    it('ignores shortcodes inside of tags', () => {
      expect(emojify('<p data-foo=":smile:"></p>')).toEqual('<p data-foo=":smile:"></p>');
    });

    it('works with unclosed tags', () => {
      expect(emojify('hello>')).toEqual('hello>');
      expect(emojify('<hello')).toEqual('<hello');
    });

    it('works with unclosed shortcodes', () => {
      expect(emojify('smile:')).toEqual('smile:');
      expect(emojify(':smile')).toEqual(':smile');
    });

    it('does unicode', () => {
      expect(emojify('\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66')).toEqual(
        '<img draggable="false" class="emojione" alt="๐ฉโ๐ฉโ๐ฆโ๐ฆ" title=":woman-woman-boy-boy:" src="/emoji/1f469-200d-1f469-200d-1f466-200d-1f466.svg" />');
      expect(emojify('๐จโ๐ฉโ๐งโ๐ง')).toEqual(
      '<img draggable="false" class="emojione" alt="๐จโ๐ฉโ๐งโ๐ง" title=":man-woman-girl-girl:" src="/emoji/1f468-200d-1f469-200d-1f467-200d-1f467.svg" />');
      expect(emojify('๐ฉโ๐ฉโ๐ฆ')).toEqual('<img draggable="false" class="emojione" alt="๐ฉโ๐ฉโ๐ฆ" title=":woman-woman-boy:" src="/emoji/1f469-200d-1f469-200d-1f466.svg" />');
      expect(emojify('\u2757')).toEqual(
      '<img draggable="false" class="emojione" alt="โ" title=":exclamation:" src="/emoji/2757.svg" />');
    });

    it('does multiple unicode', () => {
      expect(emojify('\u2757 #\uFE0F\u20E3')).toEqual(
        '<img draggable="false" class="emojione" alt="โ" title=":exclamation:" src="/emoji/2757.svg" /> <img draggable="false" class="emojione" alt="#๏ธโฃ" title=":hash:" src="/emoji/23-20e3.svg" />');
      expect(emojify('\u2757#\uFE0F\u20E3')).toEqual(
        '<img draggable="false" class="emojione" alt="โ" title=":exclamation:" src="/emoji/2757.svg" /><img draggable="false" class="emojione" alt="#๏ธโฃ" title=":hash:" src="/emoji/23-20e3.svg" />');
      expect(emojify('\u2757 #\uFE0F\u20E3 \u2757')).toEqual(
        '<img draggable="false" class="emojione" alt="โ" title=":exclamation:" src="/emoji/2757.svg" /> <img draggable="false" class="emojione" alt="#๏ธโฃ" title=":hash:" src="/emoji/23-20e3.svg" /> <img draggable="false" class="emojione" alt="โ" title=":exclamation:" src="/emoji/2757.svg" />');
      expect(emojify('foo \u2757 #\uFE0F\u20E3 bar')).toEqual(
        'foo <img draggable="false" class="emojione" alt="โ" title=":exclamation:" src="/emoji/2757.svg" /> <img draggable="false" class="emojione" alt="#๏ธโฃ" title=":hash:" src="/emoji/23-20e3.svg" /> bar');
    });

    it('ignores unicode inside of tags', () => {
      expect(emojify('<p data-foo="\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66"></p>')).toEqual('<p data-foo="\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66"></p>');
    });

    it('does multiple emoji properly (issue 5188)', () => {
      expect(emojify('๐๐๐')).toEqual('<img draggable="false" class="emojione" alt="๐" title=":ok_hand:" src="/emoji/1f44c.svg" /><img draggable="false" class="emojione" alt="๐" title=":rainbow:" src="/emoji/1f308.svg" /><img draggable="false" class="emojione" alt="๐" title=":two_hearts:" src="/emoji/1f495.svg" />');
      expect(emojify('๐ ๐ ๐')).toEqual('<img draggable="false" class="emojione" alt="๐" title=":ok_hand:" src="/emoji/1f44c.svg" /> <img draggable="false" class="emojione" alt="๐" title=":rainbow:" src="/emoji/1f308.svg" /> <img draggable="false" class="emojione" alt="๐" title=":two_hearts:" src="/emoji/1f495.svg" />');
    });

    it('does an emoji that has no shortcode', () => {
      expect(emojify('๐๏ธ')).toEqual('<img draggable="false" class="emojione" alt="๐๏ธ" title="" src="/emoji/1f549.svg" />');
    });

    it('does an emoji whose filename is irregular', () => {
      expect(emojify('โ๏ธ')).toEqual('<img draggable="false" class="emojione" alt="โ๏ธ" title=":arrow_lower_left:" src="/emoji/2199.svg" />');
    });

    it('avoid emojifying on invisible text', () => {
      expect(emojify('<a href="http://example.com/test%F0%9F%98%84"><span class="invisible">http://</span><span class="ellipsis">example.com/te</span><span class="invisible">st๐</span></a>'))
        .toEqual('<a href="http://example.com/test%F0%9F%98%84"><span class="invisible">http://</span><span class="ellipsis">example.com/te</span><span class="invisible">st๐</span></a>');
      expect(emojify('<span class="invisible">:luigi:</span>', { ':luigi:': { static_url: 'luigi.exe' } }))
        .toEqual('<span class="invisible">:luigi:</span>');
    });

    it('avoid emojifying on invisible text with nested tags', () => {
      expect(emojify('<span class="invisible">๐<span class="foo">bar</span>๐ด</span>๐'))
        .toEqual('<span class="invisible">๐<span class="foo">bar</span>๐ด</span><img draggable="false" class="emojione" alt="๐" title=":innocent:" src="/emoji/1f607.svg" />');
      expect(emojify('<span class="invisible">๐<span class="invisible">๐</span>๐ด</span>๐'))
        .toEqual('<span class="invisible">๐<span class="invisible">๐</span>๐ด</span><img draggable="false" class="emojione" alt="๐" title=":innocent:" src="/emoji/1f607.svg" />');
      expect(emojify('<span class="invisible">๐<br/>๐ด</span>๐'))
        .toEqual('<span class="invisible">๐<br/>๐ด</span><img draggable="false" class="emojione" alt="๐" title=":innocent:" src="/emoji/1f607.svg" />');
    });
  });
});
