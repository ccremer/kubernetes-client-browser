/**
 * A {@link TransformStream} that parses JSON once a stream contains a newline character.
 * This stream is intended for parsing JSON from sources that omit a JSON objects line-by-line.
 */
// Code inspired by https://rob-blackbourn.github.io/bareASGI/3.7/tutorial/streaming-fetch/
export class JSONLineStream<T> extends TransformStream<string, T> {
  constructor(errHandler: (line: string, err: unknown) => void) {
    let buf = ''
    let pos = 0
    super({
      transform(chunk: string, controller: TransformStreamDefaultController): void {
        buf += chunk
        while (pos < buf.length) {
          if (buf[pos] === '\n') {
            const line = buf.substring(0, pos)
            try {
              controller.enqueue(JSON.parse(line))
            } catch (e) {
              errHandler(line, e)
            }
            buf = buf.substring(pos + 1)
            pos = 0
          } else {
            ++pos
          }
        }
      },
    })
  }
}
