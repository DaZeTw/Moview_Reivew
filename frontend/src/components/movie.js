import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import moment from "moment";

const Movie = (props) => {
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: [],
  });

  const getMovie = (id) => {
    MovieDataService.get(id)
      .then((response) => {
        setMovie(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getMovie(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Image
            src={
              movie.poster
                ? movie.poster + "/100px250"
                : "placeholder-image-url"
            }
            fluid
          />
        </Col>
        <Col>
          <Card>
            <Card.Header as="h5">{movie.title}</Card.Header>
            <Card.Body>
              <Card.Text>{movie.plot}</Card.Text>
              {props.user && (
                <Link
                  to={"/movies/" + props.match.params.id + "/review"}
                  className="btn btn-primary"
                >
                  Add Review
                </Link>
              )}
            </Card.Body>
          </Card>
          <br />
          <h2>Reviews</h2>
          <br />
          {movie.reviews.map((review, index) => (
            <div key={index} className="mb-3">
              <h5>
                {review.name} reviewed on{" "}
                {moment(review.date).format("Do MMMM YYYY")}
              </h5>
              <p>{review.review}</p>
              {props.user && props.user.id === review.user_id && (
                <Row>
                  <Col>
                    <Link
                      to={{
                        pathname:
                          "/movies/" + props.match.params.id + "/review",
                        state: { currentReview: review },
                      }}
                      className="btn btn-secondary"
                    >
                      Edit
                    </Link>
                  </Col>
                  <Col>
                    <Button
                      variant="danger"
                      onClick={() => deleteReview(review._id, index)}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Movie;
