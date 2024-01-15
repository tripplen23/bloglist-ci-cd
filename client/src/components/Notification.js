const Notification = ({ message }) => {
  if (message === null) return null;

  if (message.includes('Error')) {
    return <div className='error'>{message.substring(5)}</div>;
  }

  return <div className='success'>{message}</div>;
};

export default Notification;
