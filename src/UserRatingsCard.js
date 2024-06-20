import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { Chip, Stack, Box } from "@mui/material";

const UserRatingsCard = ({ detail }) => {
  const { movieDetails, rating } = detail;
  const ratingValue = parseFloat(rating);

  return (
    <Card sx={{ display: "flex", maxWidth: 400, mb: 2 }}>
      <Box sx={{ minWidth: 100 }}>
        <img
          src={movieDetails[2]}
          alt={movieDetails[0]}
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {movieDetails[0]}
        </Typography>
        <Rating
          value={ratingValue}
          precision={0.5}
          readOnly
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Typography variant="body2" color="text.secondary">
          Rating: {rating} / 5
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
          {movieDetails[1].map((genre, index) => (
            <Chip key={index} label={genre} size="small" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserRatingsCard;
