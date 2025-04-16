import { Box, Typography } from '@mui/material';
import {ShareSocial} from 'react-share-social' 

const style = {
  root: {
    borderRadius: 3,
    border: 0,
    color: 'white',
  },
  copyContainer: {
    display:'none'
  }
};
 
export default function ShareSocialMedia({url}) {
  return <Box sx={{'& .react-share__ShareButton':{marginLeft:'5px'},display:'flex',alignItems:'center',justifyContent:'space-around',width:'170px',marginTop:'15px'}}>
    <Typography variant='body2' color='primary'>Partager: </Typography>
    <ShareSocial 
     url ={url}
     socialTypes={['facebook','twitter']}
     style={style}
   />
    </Box>
}