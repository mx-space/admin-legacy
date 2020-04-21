import { Editor } from 'codemirror'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/theme/3024-day.css'
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/selection/active-line.js'
// import 'codemirror-typewriter-scrolling/typewriter-scrolling.js'

import 'codemirror/lib/codemirror.css'

export const cmOptions = {
  tabSize: 2,
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  line: true,
  mode: 'text/x-gfm',
  theme: '3024-day',
  tokenTypeOverrides: {
    code: 'code',
  },
  // typewriterScrolling:
  //   !!parseInt(localStorage.getItem(PERFER.typewriter)) || false,
  highlightFormatting: true,
  keymap: 'sublime',
  extraKeys: {
    // strong
    'Cmd-B'(cm: Editor) {
      const doc = cm.getDoc()
      const selection = doc.getSelection()
      if (selection) {
        doc.replaceSelection(`**${selection}**`)
      } else {
        const cursor = doc.getCursor()
        doc.replaceRange('****', cursor)
        cursor.ch += 2
        doc.setCursor(cursor)
      }
    },
    // italic
    'Cmd-I'(cm: Editor) {
      const doc = cm.getDoc()
      const selection = doc.getSelection()
      if (selection) {
        doc.replaceSelection(`*${selection}*`)
      } else {
        const cursor = doc.getCursor()
        doc.replaceRange('**', cursor)
        cursor.ch += 1
        doc.setCursor(cursor)
      }
    },
    // underline
    'Cmd-U'(cm: Editor) {
      const doc = cm.getDoc()
      const selection = doc.getSelection()
      if (selection) {
        doc.replaceSelection(`<u>${selection}</u>`)
      } else {
        const cursor = doc.getCursor()
        doc.replaceRange('<u></u>', cursor)
        cursor.ch += 3
        doc.setCursor(cursor)
      }
    },
    // ref link
    'Cmd-K'(cm: Editor) {
      const doc = cm.getDoc()
      const cursor = doc.getCursor()
      doc.replaceRange('[]()', cursor)
      cursor.ch += 1
      doc.setCursor(cursor)
    },
    // code block
    'Alt-`'(cm: Editor) {
      const doc = cm.getDoc()
      const cursor = doc.getCursor()
      doc.replaceRange('```\n\n```', cursor)
      cursor.ch += 3
      doc.setCursor(cursor)
    },
    // tab to space
    Tab(cm: Editor) {
      const doc = cm.getDoc()
      const cursor = doc.getCursor()
      doc.replaceRange('  ', cursor)
    },
  },
}
