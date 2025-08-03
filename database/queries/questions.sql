-- name: GetQuestionsByUserID :many
SELECT *
FROM questions
WHERE user_id = $1
