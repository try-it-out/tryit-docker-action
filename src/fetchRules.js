const { Octokit } = require("@octokit/rest");
const path = require('path')
const YAML = require('yaml')

module.exports = async function getNewSemgrepRules(githubAuth, owner, repo, ref) {
	const octokitSettings = {
		userAgent: 'try-it-out/tryit-action v1.1',
		auth: githubAuth
	}

	const octokit = new Octokit(octokitSettings)
	const yamlExtNames = ['.yml', '.yaml']

	async function getFileContents(apiUrl) {
		const {data} = await octokit.request(`GET ${apiUrl}`)
		return Buffer.from(data.content, 'base64').toString('ascii')
	}

  const semgrepRules = []
  const {data} = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
    owner,
    repo,
    ref
  })
  const files = Array.isArray(data.files) && data.files || []
  const newYamlFiles = files.filter(file => {
    return file.status === 'added' && yamlExtNames.includes(path.extname(file.filename))
  })
  
  for (let i = 0; i < newYamlFiles.length; i++) {
		try {
			const content = await getFileContents(newYamlFiles[i].contents_url)
			const {rules} = YAML.parse(content)
			if (!Array.isArray(rules)) {
				continue
			}
			semgrepRules.push(...rules)
		} catch(err) {
			continue
		}
  }
  
  return semgrepRules
}
