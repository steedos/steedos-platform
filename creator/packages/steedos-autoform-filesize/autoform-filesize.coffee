formatFileSize = (filesize)->
	rev = filesize / 1024.00
	unit = 'KB'

	if rev > 1024.00
		rev = rev / 1024.00
		unit = 'MB'


	if rev > 1024.00
		rev = rev / 1024.00
		unit = 'GB'

	return rev.toFixed(2) + unit

Template.filesize.helpers
	filesizeStr: ()->
		return formatFileSize(this.value)

AutoForm.addInputType "filesize", {
	template: "filesize",
	valueOut: ()->
		return AutoForm.valueConverters.stringToNumber(this.val())
}