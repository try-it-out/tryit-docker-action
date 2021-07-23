const { Octokit } = require('@octokit/rest')
const path = require('path')
const YAML = require('yaml')

const yamlExtNames = ['.yml', '.yaml']

class RulesFetcher {
  constructor (githubAuthKey) {
    this.octokit = new Octokit({
      userAgent: 'try-it-out/tryit-action v1.1',
      auth: githubAuthKey
    })
  }

  async _getFileContents (contentsUrl) {
    const { data } = await this.octokit.request(`GET ${contentsUrl}`)
    return Buffer.from(data.content, 'base64').toString('ascii')
  }

  async getNewSemgrepRules (owner, repo, ref) {
    const semgrepRules = []
    const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner,
      repo,
      ref
    })
    const files = Array.isArray(data.files) ? data.files : []
    const newYamlFiles = files.filter(file => {
      return file.status === 'added' && yamlExtNames.includes(path.extname(file.filename))
    })

    for (let i = 0; i < newYamlFiles.length; i++) {
      try {
        const content = await this._getFileContents(newYamlFiles[i].contents_url)
        const { rules } = YAML.parse(content)
        if (!Array.isArray(rules)) {
          continue
        }
        semgrepRules.push(...rules)
      } catch (err) {
        continue
      }
    }

    return semgrepRules
  }
}

module.exports = RulesFetcher
