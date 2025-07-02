function removeVietnameseTones(str) {
	return (str || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
		.toLowerCase()
		.replace(/[\s_]/g, '');
}

export {removeVietnameseTones}
