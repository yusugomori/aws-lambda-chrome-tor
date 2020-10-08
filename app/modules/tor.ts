import { spawn, execSync, ChildProcessWithoutNullStreams } from 'child_process'
import tempfile from 'tempfile'
import { IS_LOCAL } from '../env'

export default class Tor {
  port: number
  dataDir: string
  torrcPath: string
  torPath: string = `/opt/bin/tor`
  proc: ChildProcessWithoutNullStreams

  constructor(port: number) {
    this.port = port
  }

  async launch() {
    if (IS_LOCAL) {
      return
    }

    this.createTempfiles()

    return new Promise((resolve, reject) => {
      this.proc = spawn(this.torPath, ['-f', this.torrcPath], {
        cwd: this.dataDir,
      })
      this.proc.stdout.on('data', (data: Buffer) => {
        if (data.toString().match(/100%/)) {
          resolve()
        } else {
          // console.log(`stdout ${data}`)
        }
      })

      this.proc.stderr.on('data', (data) => {
        reject(`Failed tor initialization: ${data}`)
      })

      this.proc.on('close', (code) => {
        if (code) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }

  createTempfiles() {
    this.dataDir = tempfile('.data')
    this.torrcPath = tempfile('.torrc')

    const cmds = [
      `mkdir ${this.dataDir}`,
      `touch ${this.torrcPath}`,
      `echo 'SOCKSPort ${this.port}\n' > ${this.torrcPath} && echo 'DataDirectory ${this.dataDir}\n' >> ${this.torrcPath}`,
    ]

    for (let cmd of cmds) {
      execSync(cmd)
    }
  }

  close() {
    if (IS_LOCAL) {
      return
    }

    this.proc.kill('SIGINT')

    const cmds = [`rm -rf ${this.dataDir}`, `rm -rf ${this.torrcPath}`]
    for (let cmd of cmds) {
      execSync(cmd)
    }
  }
}
