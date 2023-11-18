import fs from 'fs'
import path from 'path'

const sponsors = []

// sponsorType-SponsorName.FileType
const nameParser = (name) => {
    const [sponsorType, sName] = name.split('-')
    const sponsorName = sName.split('.')[0]
    const fileType = sName.split('.')[1]

    return {
        sponsorType,
        sponsorName,
        fileType
    }
}

const files = fs.readdirSync('./logos')

files.forEach(file => {
    const { sponsorType, sponsorName, fileType } = nameParser(file)

    sponsors.push({
        type: sponsorType,
        name: sponsorName,
        logo: './logos/' + file
    })
})

fs.writeFileSync("sponsors.js", "export default " + JSON.stringify(sponsors, null, 2) + ";")