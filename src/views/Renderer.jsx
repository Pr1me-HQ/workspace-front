export const generateColumns = (keys) => {
    let columns = keys.map(key => {
    // use switch case instead of if else
    switch (key) {
      case 'region':
      case 'branch':
        return {
          key: key,
          render: (value) => <>{value?.title || value?.name}</>,
        }
      case 'image':
      case 'avatar':
        return {
          key: key,
          render: (value) => <img src={value} alt="avatar" style={{width: '50px'}}/>,
        }
      case 'created_at':
        return {
          key: key,
          render: (value) => <>{value?.split('T')[0]}</>,
        }
      case 'type':
        return {
          key: key,
          render: (value) => <>{value?.name}</>,
        }
      default:
        return {
          key: key,
          render: (value) => <>{value}</>,
        }
      }
    })
  return columns;
}